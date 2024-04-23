import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";
import {} from "../type/api/task";
import { CreateReportReq, CreateReportRes } from "../type/report";

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
    getReports: builder.query<any, any>({
      query: () => {
        return {
          url: "/report/list",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreateReportMutation, useGetReportsQuery } = reportApi;
