import { baseApi } from "./baseApi";
import type { IDonation } from "../types/donation.types";
import type { IUser } from "../types/user.types";

export interface DonorSearchParams {
    latitude?: number;
    longitude?: number;
    radius?: number;
    bloodGroup?: string;
    city?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const donorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDonationHistory: builder.query<{ success: boolean; data: IDonation[] }, void>({
            query: () => "/donations/my-history",
            providesTags: ["Donation"],
        }),
        searchNearbyDonors: builder.query<{ success: boolean; data: IUser[] }, { latitude: number; longitude: number; radius: number; bloodGroup: string }>({
            query: (params) => ({
                url: "/donors/search",
                params,
            }),
        }),
        searchAllDonors: builder.query<{ success: boolean; data: { donors: IUser[], total: number, page: number, pages: number } }, DonorSearchParams>({
            query: (params) => ({
                url: "/donors/search-all",
                params,
            }),
        }),
    }),
});

export const {
    useGetDonationHistoryQuery,
    useSearchNearbyDonorsQuery,
    useSearchAllDonorsQuery
} = donorApi;
