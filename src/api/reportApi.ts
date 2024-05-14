import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";
import {} from "../type/api/task";
import {
  CreateReportReq,
  CreateReportRes,
  GetReportRes,
  GetReportsReq,
} from "../type/report";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth(baseQuery),
  endpoints: (builder) => ({
    createReport: builder.mutation<CreateReportRes, CreateReportReq>({
      query: ({ body }) => {
        console.log(body);
        return {
          url: "/report/create",
          method: "POST",
          body,
        };
      },
    }),
    getReports: builder.query<GetReportRes, GetReportsReq>({
      query: ({ user_id }) => {
        return {
          url: `/report/list?user=${user_id}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreateReportMutation, useGetReportsQuery } = reportApi;
