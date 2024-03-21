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
    testTaskPost: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        console.log(file);

        return {
          url: "/task/test",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useGetTaskListQuery, useTestTaskPostMutation } = taskApi;
