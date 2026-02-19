import { baseApi } from "./baseApi";
import type { ISystemStats, IBloodDemand, IBloodRequest } from "../types/request.types";
import type { IUser } from "../types/user.types";

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSystemStats: builder.query<{ success: boolean; data: ISystemStats }, void>({
            query: () => "/admin/stats",
            providesTags: ["Stats"],
        }),
        getBloodDemand: builder.query<{ success: boolean; data: IBloodDemand[] }, void>({
            query: () => "/admin/analytics/blood-demand",
            providesTags: ["Stats"],
        }),
        getAllRequests: builder.query<{ success: boolean; count: number; data: IBloodRequest[] }, void>({
            query: () => "/admin/requests",
            providesTags: ["Request"],
        }),
        getPendingHospitals: builder.query<{ success: boolean; count: number; data: IUser[] }, void>({
            query: () => "/admin/hospitals/pending",
            providesTags: ["Hospital"],
        }),
        approveHospital: builder.mutation<{ success: boolean; data: IUser }, string>({
            query: (hospitalId) => ({
                url: `/admin/hospitals/${hospitalId}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["Hospital"],
        }),
        rejectHospital: builder.mutation<{ success: boolean; data: { message: string } }, string>({
            query: (hospitalId) => ({
                url: `/admin/hospitals/${hospitalId}/reject`,
                method: "DELETE",
            }),
            invalidatesTags: ["Hospital"],
        }),
        getLowStockHospitals: builder.query<{ success: boolean; count: number; data: IUser[] }, void>({
            query: () => "/admin/hospitals/low-stock",
            providesTags: ["Hospital"],
        }),
    }),
});

export const {
    useGetSystemStatsQuery,
    useGetBloodDemandQuery,
    useGetAllRequestsQuery,
    useGetPendingHospitalsQuery,
    useApproveHospitalMutation,
    useRejectHospitalMutation,
    useGetLowStockHospitalsQuery
} = adminApi;
