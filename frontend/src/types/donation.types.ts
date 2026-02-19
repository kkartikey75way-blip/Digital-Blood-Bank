import type { IUser } from "./user.types";
import type { IBloodRequest } from "./request.types";

export interface IDonation {
    _id: string;
    donor: IUser | string;
    patient: IUser | string;
    request: IBloodRequest | string;
    donatedAt: string;
    createdAt: string;
    updatedAt: string;
}
