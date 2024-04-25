import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";
import {
  CreateTaskReq,
  CreateTaskRes,
  DeleteTaskReq,
  DeleteTaskRes,
  GetTaskDetailReq,
  GetTaskDetailRes,
  GetTaskListRes,
  UpdateTaskReq,
  UpdateTaskRes,
} from "../type/task";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseQueryWithReauth(baseQuery),
  endpoints: (builder) => ({
    getTaskList: builder.query<GetTaskListRes, void>({
      query: () => ({
        url: "/task/list",
        method: "GET",
      }),
    }),
    getTaskDetail: builder.mutation<GetTaskDetailRes, GetTaskDetailReq>({
      query: ({ body }) => ({
        url: "/task/detail",
        method: "GET",
        body,
      }),
    }),
    updateTask: builder.mutation<UpdateTaskRes, UpdateTaskReq>({
      query: ({ body }) => ({
        url: "/task/update",
        method: "POST",
        body,
      }),
    }),
    createTask: builder.mutation<CreateTaskRes, CreateTaskReq>({
      query: ({ body }) => ({
        url: "/task/create",
        method: "POST",
        body,
      }),
    }),
    deleteTask: builder.mutation<DeleteTaskRes, DeleteTaskReq>({
      query: ({ body }) => ({
        url: "/task/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetTaskListQuery,
  useGetTaskDetailMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
