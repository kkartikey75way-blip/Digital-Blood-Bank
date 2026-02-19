import { baseApi } from "./baseApi";
import type { CreateEmergencyRequest, IBloodRequest } from "../types/request.types";

export const requestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createEmergency: builder.mutation<void, CreateEmergencyRequest>({
            query: (requestData) => ({
                url: "/requests",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["Request"],
        }),
        getNearbyRequests: builder.query<{ success: boolean; data: IBloodRequest[] }, { latitude: number; longitude: number; radius: number; bloodGroup: string }>({
            query: (params) => ({
                url: "/requests/nearby",
                params,
            }),
            providesTags: ["Request"],
        }),
        getMyRequests: builder.query<{ success: boolean; data: IBloodRequest[] }, void>({
            query: () => "/requests/my-requests",
            providesTags: ["Request"],
        }),
        acceptRequest: builder.mutation<{ success: boolean; data: IBloodRequest }, string>({
            query: (requestId) => ({
                url: `/requests/${requestId}/accept`,
                method: "PATCH",
            }),
            invalidatesTags: ["Request"],
        }),
        completeRequest: builder.mutation<{ success: boolean; data: IBloodRequest }, string>({
            query: (requestId) => ({
                url: `/requests/${requestId}/complete`,
                method: "PATCH",
            }),
            invalidatesTags: ["Request"],
        }),
    }),
});

export const {
    useCreateEmergencyMutation,
    useGetNearbyRequestsQuery,
    useGetMyRequestsQuery,
    useAcceptRequestMutation,
    useCompleteRequestMutation
} = requestApi;
