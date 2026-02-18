import { baseApi } from "./baseApi";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/auth.types";

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
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
