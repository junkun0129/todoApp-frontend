import { Result, VoidResponse } from "./common";
export type Report = {
  report_id: string;
  user_id: string;
  created_at: string;
  date: string;
  status: "rest" | "plan";
  hours: number;
  category: string;
};

export type PairedReportList = {
  date: string;
  plan: ReportList | null;
  result: ReportList | null;
};
export type ReportList = {
  report: Report;
  dailytasks: DailyTask[];
};
export type CreateReportReq = {
  body: {
    report: {
      date: string;
      category: string;
      status: string;
      hours: number;
    };
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
  date: string;
  category: string;
};

export type GetReportsRes = {
  result: Result;
  data: PairedReportList[];
};

export type GetReportReq = {
  date: string;
  category: string;
};

export type GetReportRes = {
  result: Result;
  data: any;
};
