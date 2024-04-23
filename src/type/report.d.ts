import { VoidResponse } from "./common";

export type CreateReportReq = {
  body: {
    title: string;
    body: string;
  };
};

export type CreateReportRes = VoidResponse;
