import mongoose from "mongoose";
import { BloodRequest, RequestStatus } from "../models/request.model";
import { User, UserRole } from "../models/user.model";
import { BloodStock, IBloodStock } from "../models/bloodStock.model";
import { Donation } from "../models/donation.model";
import { getIO } from "../utils/io";
import { createNotification, notifyUrgentNearby } from "./notification.service";
import { NotificationType } from "../models/notification.model";
import { logActivity } from "./activity.service";
import { ActivityType } from "../models/activity.model";
import { getCompatibleRecipients, BloodGroup } from "../utils/compatibility.utils";

export const createEmergencyRequest = async (
    userId: string,
    bloodGroup: string,
    units: number,
    latitude: number,
    longitude: number,
    urgencyLevel: "LOW" | "MEDIUM" | "HIGH"
) => {
    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new Error("Invalid location coordinates");
    }
    const user = await User.findById(userId);

    if (!user || (user.role !== UserRole.PATIENT && user.role !== UserRole.HOSPITAL)) {
        throw new Error("Only patients and hospitals can create blood requests");
    }

    if (user.isBlocked) {
        throw new Error("User account is blocked");
    }
    const existingRequest = await BloodRequest.findOne({
        patient: userId,
        status: { $in: [RequestStatus.PENDING, RequestStatus.APPROVED] },
    });

    if (existingRequest) {
        throw new Error(
            "You already have an active emergency request"
        );
    }
    const request = await BloodRequest.create({
        bloodGroup,
        units,
        patient: new mongoose.Types.ObjectId(userId),
        urgencyLevel,
        status: RequestStatus.PENDING,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
    });
    const socketIo = getIO();
    socketIo.emit("newEmergency", {
        requestId: request._id,
        bloodGroup,
        urgencyLevel,
        location: {
            latitude,
            longitude,
        },
    });

    // Notify Patient
    await createNotification(
        userId,
        NotificationType.REQUEST_CREATED,
        "Request Created",
        `Your request for ${bloodGroup} blood has been submitted and is pending approval.`,
        request._id.toString()
    );

    // Notify Nearby Donors
    notifyUrgentNearby(request._id.toString(), bloodGroup, latitude, longitude).catch(err => console.error("Nearby notification failed:", err));

    await logActivity(
        userId,
        ActivityType.REQUEST_CREATED,
        "Emergency Created & Broadcasted",
        `Requested ${units} units of ${bloodGroup} blood and notified nearby donors.`
    );

    return request;
};

export const approveRequest = async (
    requestId: string,
    hospitalId: string
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const request = await BloodRequest.findById(requestId).session(session);
        if (!request) throw new Error("Request not found");
        if (request.status !== RequestStatus.PENDING) throw new Error("Request already processed");

        const hospital = await User.findById(hospitalId).session(session);
        if (!hospital || hospital.role !== UserRole.HOSPITAL) throw new Error("Unauthorized");

        const bloodGroupKey = request.bloodGroup.replace("+", "_POS").replace("-", "_NEG") as keyof IBloodStock;

        let stockRecord = await BloodStock.findOne({ hospital: hospitalId }).session(session);
        if (!stockRecord) {
            stockRecord = new BloodStock({ hospital: hospitalId });
        }

        const currentStock = (stockRecord.get(bloodGroupKey) as number) || 0;
        if (currentStock < request.units) {
            throw new Error("Insufficient blood stock");
        }

        // Reduce stock
        stockRecord.set(bloodGroupKey, currentStock - request.units);
        stockRecord.lastUpdated = new Date();
        await stockRecord.save({ session });

        request.status = RequestStatus.APPROVED;
        request.processedBy = new mongoose.Types.ObjectId(hospitalId);
        await request.save({ session });

        await session.commitTransaction();

        // Notify Patient (Non-blocking)
        createNotification(
            request.patient.toString(),
            NotificationType.REQUEST_APPROVED,
            "Request Approved",
            `Great news! Your request for ${request.bloodGroup} has been approved. A donor will be assigned soon.`,
            request._id.toString()
        ).catch(err => console.error("Notification failed:", err));

        await logActivity(
            hospitalId,
            ActivityType.REQUEST_PROCESSED,
            "Request Approved",
            `Approved ${request.bloodGroup} request for ${request.units} units`,
            undefined,
            { requestId: request._id }
        );

        return request;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const rejectRequest = async (requestId: string, userId: string) => {
    const request = await BloodRequest.findById(requestId);
    if (!request) throw new Error("Request not found");

    request.status = RequestStatus.REJECTED;
    request.processedBy = new mongoose.Types.ObjectId(userId);
    await request.save();

    // Notify Patient
    createNotification(
        request.patient.toString(),
        NotificationType.REQUEST_REJECTED,
        "Request Rejected",
        `Unfortunately, your request for ${request.bloodGroup} was rejected. Please contact support or try another location.`,
        request._id.toString()
    ).catch(err => console.error("Notification failed:", err));

    await logActivity(
        userId,
        ActivityType.REQUEST_PROCESSED,
        "Request Rejected",
        `Rejected ${request.bloodGroup} request`,
        undefined,
        { requestId: request._id }
    );

    return request;
};

export const acceptEmergencyRequest = async (
    requestId: string,
    donorId: string
) => {
    const request = await BloodRequest.findById(requestId);

    if (!request) {
        throw new Error("Request not found");
    }

    if (request.status !== RequestStatus.PENDING) {
        throw new Error("Request already handled");
    }

    const activeRequest = await BloodRequest.findOne({
        processedBy: donorId,
        status: RequestStatus.APPROVED,
    });

    if (activeRequest) {
        throw new Error("You already have an active request");
    }

    request.status = RequestStatus.APPROVED;
    request.processedBy = new mongoose.Types.ObjectId(donorId);

    await request.save();

    await request.save();
    return request;
};

export const rejectDonor = async (requestId: string, patientId: string) => {
    const request = await BloodRequest.findById(requestId);

    if (!request) {
        throw new Error("Request not found");
    }

    if (request.patient.toString() !== patientId) {
        throw new Error("Unauthorized");
    }

    if (request.status !== RequestStatus.APPROVED || !request.processedBy) {
        throw new Error("No active donor to reject");
    }

    const donorId = request.processedBy;

    // Reset request
    request.status = RequestStatus.PENDING;
    request.processedBy = undefined;
    await request.save();

    // Notify Donor
    createNotification(
        donorId.toString(),
        NotificationType.REQUEST_REJECTED,
        "Donation Rejected",
        "The patient has declined your offer to donate for this request.",
        request._id.toString()
    ).catch(err => console.error("Notification failed:", err));

    return request;
};

export const findNearbyEmergencyRequests = async (
    userId: string,
    latitude: number,
    longitude: number,
    radiusInKm: number,
    bloodGroup: string
) => {
    const radiusInMeters = radiusInKm * 1000;
    const compatibleGroups = getCompatibleRecipients(bloodGroup as BloodGroup);

    const requests = await BloodRequest.find({
        patient: { $ne: userId },
        bloodGroup: { $in: compatibleGroups },
        status: { $in: [RequestStatus.PENDING, RequestStatus.APPROVED] },
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                $maxDistance: radiusInMeters,
            },
        },
    })
        .populate("patient", "name phone")
        .sort({ createdAt: -1 });

    return requests;
};

export const completeEmergencyRequest = async (
    requestId: string,
    userId: string
) => {
    const request = await BloodRequest.findById(requestId);

    if (!request) {
        throw new Error("Request not found");
    }

    if (request.status !== RequestStatus.APPROVED) {
        throw new Error("Request is not in approved state");
    }

    const isDonor = request.processedBy?.toString() === userId;
    const isPatient = request.patient?.toString() === userId;

    if (!isDonor && !isPatient) {
        throw new Error("Unauthorized to complete this request");
    }

    request.status = RequestStatus.COMPLETED;
    await request.save();

    // Award points to the donor, not the person who confirms the request
    const actualDonorId = request.processedBy;
    const donor = await User.findById(actualDonorId);

    if (donor) {
        donor.lastDonationDate = new Date();
        donor.isAvailable = false;

        // Update Rank & Award Badges
        const currentPoints = donor.impactPoints || 0;
        donor.impactPoints = currentPoints + 10;

        const badges = new Set(donor.badges || []);

        if (donor.impactPoints >= 150) {
            badges.add("Life Vanguard");
            badges.add("Hero");
        }
        if (donor.impactPoints >= 50) badges.add("Regular Hero");
        if (donor.impactPoints >= 10) badges.add("First Drop");

        donor.badges = Array.from(badges);
        donor.markModified("badges");

        if (donor.impactPoints >= 150) donor.rank = "Hero";
        else if (donor.impactPoints >= 50) donor.rank = "Life Saver";
        else donor.rank = "Novice";

        await donor.save();
    }

    // Create donation history record
    await Donation.create({
        donor: actualDonorId,
        patient: request.patient,
        request: request._id,
    });

    return request;
};



export const fulfillRequest = async (requestId: string, hospitalId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const request = await BloodRequest.findById(requestId).session(session);
        if (!request) throw new Error("Request not found");
        if (request.status !== RequestStatus.APPROVED) {
            throw new Error("Only approved requests can be fulfilled");
        }

        request.status = RequestStatus.COMPLETED;
        await request.save({ session });

        // Create Donation Record
        await Donation.create([{
            donor: request.processedBy || hospitalId,
            patient: request.patient,
            request: request._id,
            donatedAt: new Date(),
        }], { session });

        await session.commitTransaction();

        // Notify Patient (Out of transaction for performance)
        createNotification(
            request.patient.toString(),
            NotificationType.REQUEST_APPROVED,
            "Request Fulfilled",
            `Your request for ${request.bloodGroup} blood has been successfully fulfilled. We wish you a speedy recovery!`,
            request._id.toString()
        ).catch(err => console.error("Notification failed:", err));

        await logActivity(
            hospitalId,
            ActivityType.REQUEST_PROCESSED,
            "Request Fulfilled",
            `Successfully fulfilled ${request.bloodGroup} request`,
            undefined,
            { requestId: request._id }
        );

        return request;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getUserRequests = async (userId: string) => {
    return await BloodRequest.find({ patient: userId })
        .populate("processedBy", "name phone role bloodGroup location")
        .sort({ createdAt: -1 });
};
