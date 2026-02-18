import mongoose from "mongoose";
import { BloodRequest, RequestStatus } from "../models/request.model";
import { User } from "../models/user.model";
import { Donation } from "../models/donation.model";

export const createEmergencyRequest = async (
    userId: string,
    bloodGroup: string,
    latitude: number,
    longitude: number,
    urgencyLevel: "LOW" | "MEDIUM" | "HIGH"
) => {

    const existingRequest = await BloodRequest.findOne({
        patient: userId,
        status: { $in: ["PENDING", "ACCEPTED"] },
    });

    if (existingRequest) {
        throw new Error("You already have an active emergency request");
    }

    const request = await BloodRequest.create({
        bloodGroup,
        patient: userId,
        urgencyLevel,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
    });

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



