// src/services/authApi.ts
import type { LoginResponse, RegisterResponse } from "../../types";
import { api } from "../api/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation<
      LoginResponse,
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: "auth/admin/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    registerAdmin: builder.mutation<
      RegisterResponse,
      {
        email: string;
        firstname: string;
        lastname: string;
        phone: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: "auth/register/admin",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginAdminMutation, useRegisterAdminMutation } = authApi;
