import { baseApi } from "./baseApi";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/auth.types";
import type { IUser } from "../types/user.types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
        }),
        register: builder.mutation<void, RegisterRequest>({
            query: (userData) => ({
                url: "/auth/register",
                method: "POST",
                body: userData,
            }),
        }),
        getProfile: builder.query<{ success: boolean; data: IUser }, void>({
            query: () => "/auth/me",
            providesTags: ["User"],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } = authApi;
