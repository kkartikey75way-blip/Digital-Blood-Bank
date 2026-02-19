import { baseApi } from "./baseApi";
import type { IBloodRequest } from "../types/request.types";

export interface IAdminAnalytics {
    bloodGroupDistribution: Array<{ _id: string; count: number }>;
    requestTrends: Array<{ _id: string; count: number }>;
    overview: {
        totalDonations: number;
        pendingRequests: number;
        approvedRequests: number;
    };
}

export interface IHospitalAnalytics {
    stock: Record<string, number>;
    recentActivity: IBloodRequest[];
}

export const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminAnalytics: builder.query<{ success: boolean; data: IAdminAnalytics }, void>({
            query: () => "/analytics/admin",
            providesTags: ["Stats"],
        }),
        getHospitalAnalytics: builder.query<{ success: boolean; data: IHospitalAnalytics }, void>({
            query: () => "/analytics/hospital",
            providesTags: ["Stats"],
        }),
    }),
});

export const { useGetAdminAnalyticsQuery, useGetHospitalAnalyticsQuery } = analyticsApi;
