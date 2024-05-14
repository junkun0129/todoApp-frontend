import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";
import { UpdateProfileRequest, UpdateProfileResponse } from "../type/api/user";
import { GetUserListRes } from "../type/user";

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
    getUserList: builder.query<GetUserListRes, void>({
      query: (email) => ({
        url: `/user/list`,
        method: "GET",
      }),
    }),
    updateImg: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        console.log(file);

        return {
          url: "/user/imgupdate",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useGetProfileQuery,
  useUpdateImgMutation,
  useGetUserListQuery,
} = userApi;
