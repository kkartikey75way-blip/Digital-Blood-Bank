import { baseApi } from "./baseApi";
import type { IBloodStock } from "../types/user.types";

export const hospitalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStock: builder.query<{ success: boolean; data: { bloodStock: IBloodStock, lowStockGroups: string[], isVerified: boolean } }, void>({
            query: () => "/hospitals/stock",
            providesTags: ["Stock"],
        }),
        updateStock: builder.mutation<{ success: boolean; data: IBloodStock }, { bloodGroup: string; units: number }>({
            query: (body) => ({
                url: "/hospitals/stock",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Stock"],
        }),
    }),
});

export const { useGetStockQuery, useUpdateStockMutation } = hospitalApi;
