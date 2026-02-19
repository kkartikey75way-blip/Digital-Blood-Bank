import type { IBloodRequest } from "./request.types";

export interface IDonationHistory {
    _id: string;
    donor: string;
    request: string | IBloodRequest;
    donatedAt: string;
    createdAt: string;
    updatedAt: string;
}
