import { Result, VoidResponse } from "./common";
export type Report = {
  report_id: string;
  user_id: string;
  created_at: string;
  title: string;
  body: string;
};

export type ReportList = {
  title: string;
  user_name: string;
  img: string;
  created_at: string;
};
export type CreateReportReq = {
  body: {
    title: string;
    body: string;
  };
};

export type CreateReportRes = VoidResponse;

export type GetReportsReq = {
  date: string;
};

export type GetReportRes = {
  result: Result;
  data: ReportList[];
};
