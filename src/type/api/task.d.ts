import { Result } from "../response";
import { TaskGroup } from "../task";
export type GetTaskListResponse = {
  result: Result;
  data: TaskGroup[];
};
export type CreateTaskGroupRequest = {
  body: {
    name: string;
  };
};
export type CreateTaskGroupResponse = {
  result: Result;
};

export type CreateTaskRequest = {
  body: {
    user_id: number;
    taskgroup_id: number;
    title: string;
    description: string;
  };
};

export type CreateTaskResponse = {
  result: Result;
};
export type DeleteTaskRequest = {
  body: {
    id: number;
  };
};

export type DeleteTaskResponse = {
  result: Result;
};

export type DeleteTaskGroupRequest = {
  body: {
    id: number;
  };
};
export type DeleteTaskGroupResponse = {
  result: Result;
  message?: string;
};

export type UpdateTaskRequest = {
  body: {
    task_id: number;
    title: string;
    description: string;
    status: string;
  };
};

export type UpdateTaskResponse = {
  result: Result;
  message: string;
};
