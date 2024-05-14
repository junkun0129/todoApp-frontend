import { Result, VoidResponse } from "./common";

export type ReportList = {
  report: { date: string };
  dailytasks: DailyTask[];
};
export type CreateReportReq = {
  body: {
    date: string;
    dailyTasks: DailyTask[];
  };
};

export type DailyTask = {
  task_id: string;
  result: string;
  improve: string;
  starttime: number;
  endtime: number;
};

export type CreateReportRes = VoidResponse;

export type GetReportsReq = {
  user_id: string;
};

export type GetReportRes = {
  result: Result;
  data: ReportList[];
};
