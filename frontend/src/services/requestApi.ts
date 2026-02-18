import { baseApi } from "./baseApi";
import type { CreateEmergencyRequest } from "../types/request.types";

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
        getNearbyRequests: builder.query<any, { latitude: number; longitude: number; radius: number; bloodGroup: string }>({
            query: (params) => ({
                url: "/requests/nearby",
                params,
            }),
            providesTags: ["Request"],
        }),
    }),
});

export const { useCreateEmergencyMutation, useGetNearbyRequestsQuery } = requestApi;
