import mongoose from "mongoose";
import { BloodRequest, RequestStatus } from "../models/request.model";
import { User, UserRole } from "../models/user.model";
import { Donation } from "../models/donation.model";
import { io } from "../server";

export const createEmergencyRequest = async (
    userId: string,
    bloodGroup: string,
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

    if (!user || user.role !== UserRole.PATIENT) {
        throw new Error("Only patients can create emergency requests");
    }

    if (user.isBlocked) {
        throw new Error("User account is blocked");
    }
    const existingRequest = await BloodRequest.findOne({
        patient: userId,
        status: { $in: [RequestStatus.PENDING, RequestStatus.ACCEPTED] },
    });

    if (existingRequest) {
        throw new Error(
            "You already have an active emergency request"
        );
    }
    const request = await BloodRequest.create({
        bloodGroup,
        patient: new mongoose.Types.ObjectId(userId),
        urgencyLevel,
        status: RequestStatus.PENDING,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
    });
    io.emit("newEmergency", {
        requestId: request._id,
        bloodGroup,
        urgencyLevel,
        location: {
            latitude,
            longitude,
        },
    });

    return request;
};

export const acceptEmergencyRequest = async (
    requestId: string,
    donorId: string
) => {
    const request = await BloodRequest.findById(requestId);
    console.log(request);

    if (!request) {
        throw new Error("Request not found");
    }

    if (request.status !== RequestStatus.PENDING) {
        throw new Error("Request already handled");
    }

    const activeRequest = await BloodRequest.findOne({
        acceptedBy: donorId,
        status: RequestStatus.ACCEPTED,
    });

    if (activeRequest) {
        throw new Error("You already have an active request");
    }

    request.status = RequestStatus.ACCEPTED;
    request.acceptedBy = new mongoose.Types.ObjectId(donorId);

    await request.save();

    return request;
};

export const findNearbyEmergencyRequests = async (
    latitude: number,
    longitude: number,
    radiusInKm: number,
    bloodGroup: string
) => {
    const radiusInMeters = radiusInKm * 1000;

    const requests = await BloodRequest.find({
        bloodGroup,
        status: RequestStatus.PENDING,
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
    donorId: string
) => {
    const request = await BloodRequest.findById(requestId);

    if (!request) {
        throw new Error("Request not found");
    }

    if (request.status !== RequestStatus.ACCEPTED) {
        throw new Error("Request is not in accepted state");
    }

    if (request.acceptedBy?.toString() !== donorId) {
        throw new Error("Only assigned donor can complete this request");
    }

    request.status = RequestStatus.COMPLETED;
    await request.save();

    const donor = await User.findById(donorId);

    if (donor) {
        donor.lastDonationDate = new Date();
        donor.isAvailable = false;
        await donor.save();
    }

    // Create donation history record
    await Donation.create({
        donor: donorId,
        patient: request.patient,
        request: request._id,
    });

    return request;
};



export const getUserRequests = async (userId: string) => {
    return await BloodRequest.find({ patient: userId }).sort({ createdAt: -1 });
};
