import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  FillHistory,
  PaginatedUsersResponse,
  UserHealthLog,
} from "../../types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_BASE_URL ||
      "https://data-app-be-production.up.railway.app/v1/" + "dashboard/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsersWithFilters: builder.query<
      PaginatedUsersResponse,
      {
        page: number;
        limit: number;
        search?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ page, limit, search, startDate, endDate }) => ({
        url: "users",
        params: { page, limit, search, startDate, endDate },
      }),
      providesTags: ["User"],
    }),

    getFillHistory: builder.query<
      FillHistory[],
      { userId: string; n?: number }
    >({
      query: ({ userId, n = 10 }) => ({
        url: `users/${userId}/fill-history`,
        params: { n },
      }),
    }),

    getUserHealthLogs: builder.query<
      UserHealthLog[],
      { userId: string; n?: number }
    >({
      query: ({ userId, n = 10 }) => ({
        url: `users/${userId}/logs`,
        params: { n },
      }),
    }),
    sendReminder: builder.mutation<void, { userId: string; note?: string }>({
      query: ({ userId, note }) => ({
        url: `users/${userId}/send-reminder`,
        method: "POST",
        body: { note },
      }),
    }),

    changePassword: builder.mutation<
      void,
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "change-password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetUsersWithFiltersQuery,
  useGetFillHistoryQuery,
  useGetUserHealthLogsQuery,
  useSendReminderMutation,
  useChangePasswordMutation,
} = userApi;
