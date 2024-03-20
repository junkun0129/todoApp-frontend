import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseQueryWithReauth(baseQuery),
  endpoints: (builder) => ({
    getTaskList: builder.query<any, void>({
      query: () => ({
        url: "/task/list",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTaskListQuery } = taskApi;
