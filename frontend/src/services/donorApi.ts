import { baseApi } from "./baseApi";
import type { IDonation } from "../types/donation.types";

export const donorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDonationHistory: builder.query<{ success: boolean; data: IDonation[] }, void>({
            query: () => "/donations/my-history",
            providesTags: ["Donation"],
        }),
    }),
});

export const { useGetDonationHistoryQuery } = donorApi;
