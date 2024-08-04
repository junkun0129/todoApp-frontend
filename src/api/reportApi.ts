import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";
import {} from "../type/api/task";
import {
  CreateReportReq,
  CreateReportRes,
  GetReportReq,
  GetReportRes,
  GetReportsReq,
  GetReportsRes,
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
    getReports: builder.query<GetReportsRes, GetReportsReq>({
      query: ({ date = "", category = "" }) => {
        return {
          url: `/report/list?&date=${date}&category=${category}`,
          method: "GET",
        };
      },
    }),
    getReport: builder.mutation<GetReportRes, GetReportReq>({
      query: ({ date = "", category = "" }) => {
        return {
          url: `/report/get?date=${date}&category=${category}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateReportMutation,
  useGetReportsQuery,
  useGetReportMutation,
} = reportApi;
