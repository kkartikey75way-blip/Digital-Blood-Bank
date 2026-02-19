import { baseApi } from "./baseApi";

export interface INotification {
    _id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<{ success: boolean; data: INotification[] }, void>({
            query: () => "/notifications",
            providesTags: ["Notifications"],
        }),
        markAsRead: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAllAsRead: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "/notifications/read-all",
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
} = notificationApi;
