import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ActivityLogQuery, DashboardStats } from "../../types";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      `${
        import.meta.env.VITE_API_BASE_URL ||
        "https://data-app-be-production.up.railway.app/v1/"
      }` + "dashboard/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    getAdmins: builder.query<any, void>({
      query: () => "admins",
      providesTags: ["Admin"],
    }),
    promoteAdmin: builder.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: "admins/promote",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Admin"],
    }),
    removeAdmin: builder.mutation<void, string>({
      query: (userId) => ({
        url: `admins/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "",
      transformResponse: (response: { data: DashboardStats }) => response.data,
    }),

    getActivityLogs: builder.query<any, ActivityLogQuery>({
      query: ({ type = "daily", date, week }) => ({
        url: "dashboard/log-activity",
        params: { type, date, week },
      }),
    }),
  }),
});

export const {
  useGetAdminsQuery,
  usePromoteAdminMutation,
  useRemoveAdminMutation,
  useGetDashboardStatsQuery,
  useGetActivityLogsQuery,
} = adminApi;
