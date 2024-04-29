import { Result, VoidResponse } from "./common";
export type TaskStatus = "NEW" | "PROCESS" | "DONE";
export type TaskList = {
  task_id: string;
  title: string;
  created_at: string;
  user_name: string;
  img: string;
  status: TaskStatus;
  task_order: number;
};
export type TaskDetail = {
  task_id: string;
  title: string;
  body: string;
  created_at: string;
  user_name: string;
  img: string;
};

export type GetTaskListReq = {
  body: {};
};

export type GetTaskListRes = {
  result: Result;
  data: TaskList[];
  message?: string;
};

export type GetTaskDetailReq = {
  body: {
    task_id: string;
  };
};
export type GetTaskDetailRes = {
  result: Result;
  data: TaskDetail;
  message?: string;
};
export type CreateTaskReq = {
  body: {
    title: string;
    body: string;
  };
};
export type CreateTaskRes = VoidResponse;
export type UpdateTaskReq = {
  body: { task_id: string; title: string; body: string; status: string };
};

export type UpdateTaskRes = VoidResponse;

export type DeleteTaskReq = {
  body: { task_id: string };
};

export type DeleteTaskRes = VoidResponse;

export type ChangeStatusAndOrderReq = {
  body: ChangeStatusAndOrderBody;
};

export type ChangeStatusAndOrderBody = {
  task_id: string;
  order: number;
  status: string;
};
export type ChangeStatusAndOrderRes = VoidResponse;
