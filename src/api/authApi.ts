import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";
import { SignInReq, SignInRes, SignUpReq, SignUpRes } from "../type/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth(baseQuery),
  endpoints: (builder) => ({
    signup: builder.mutation<SignUpRes, SignUpReq>({
      query: ({ body }) => {
        console.log(body);
        return {
          url: `auth/signup`,
          method: "POST",
          body,
        };
      },
    }),
    signin: builder.mutation<SignInRes, SignInReq>({
      query: ({ body }) => {
        return {
          url: `auth/signin`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useSignupMutation, useSigninMutation } = authApi;
