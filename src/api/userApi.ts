import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";
import { UpdateProfileRequest, UpdateProfileResponse } from "../type/api/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth(baseQuery),
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: ({ body }) => ({
        url: "/user/edit",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<any, string>({
      query: (email) => ({
        url: `/user/get`,
        method: "POST",
        body: {
          email,
        },
      }),
    }),
  }),
});

export const { useUpdateProfileMutation, useGetProfileQuery } = userApi;
