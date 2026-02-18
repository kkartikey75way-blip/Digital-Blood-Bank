import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { getAccessToken, getRefreshToken, setTokens, clearAuthStorage } from "../utils/auth";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
        const token = getAccessToken();
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // Wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Checking if the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    const refreshResult: any = await baseQuery(
                        {
                            url: "/auth/refresh",
                            method: "POST",
                            body: { refreshToken },
                        },
                        api,
                        extraOptions
                    );

                    if (refreshResult.data) {
                        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResult.data.data;
                        setTokens(newAccessToken, newRefreshToken);
                        // Retry the initial query
                        result = await baseQuery(args, api, extraOptions);
                    } else {
                        clearAuthStorage();
                        window.location.href = "/";
                    }
                } else {
                    clearAuthStorage();
                    window.location.href = "/";
                }
            } finally {
                release();
            }
        } else {
            // Wait until the mutex is available and retry
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Request", "Donation"],
    endpoints: () => ({}),
});
