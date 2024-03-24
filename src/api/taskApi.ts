import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./appApi";
import {
  CreateTaskGroupRequest,
  CreateTaskGroupResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskGroupRequest,
  DeleteTaskGroupResponse,
  DeleteTaskRequest,
  DeleteTaskResponse,
  GetTaskListResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from "../type/api/task";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseQueryWithReauth(baseQuery),
  endpoints: (builder) => ({
    getTaskList: builder.query<GetTaskListResponse, void>({
      query: () => ({
        url: "/task/grouplist",
        method: "GET",
      }),
    }),
    getTaskDetail: builder.mutation<any, number>({
      query: (id) => ({
        url: "/task/getdetail",
        method: "POST",
        body: {
          id,
        },
      }),
    }),
    createTaskGroup: builder.mutation<
      CreateTaskGroupResponse,
      CreateTaskGroupRequest
    >({
      query: ({ body }) => ({
        url: "/task/createtaskgroup",
        method: "POST",
        body,
      }),
    }),
    createTask: builder.mutation<CreateTaskResponse, CreateTaskRequest>({
      query: ({ body }) => ({
        url: "/task/createtask",
        method: "POST",
        body,
      }),
    }),
    updateTask: builder.mutation<UpdateTaskResponse, UpdateTaskRequest>({
      query: ({ body }) => ({
        url: "/task/updatetask",
        method: "POST",
        body,
      }),
    }),
    deleteTask: builder.mutation<DeleteTaskResponse, DeleteTaskRequest>({
      query: ({ body }) => ({
        url: "/task/delete",
        method: "POST",
        body,
      }),
    }),
    deleteTaskGroup: builder.mutation<
      DeleteTaskGroupResponse,
      DeleteTaskGroupRequest
    >({
      query: ({ body }) => ({
        url: "/task/deletegroup",
        method: "POST",
        body,
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

export const {
  useGetTaskListQuery,
  useTestTaskPostMutation,
  useCreateTaskGroupMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useDeleteTaskGroupMutation,
  useUpdateTaskMutation,
  useGetTaskDetailMutation,
} = taskApi;
