import { Donation } from "../models/donation.model";

export const getDonorHistory = async (donorId: string) => {
    const history = await Donation.find({ donor: donorId })
        .populate("patient", "name phone")
        .sort({ donatedAt: -1 });

    return history;
};
