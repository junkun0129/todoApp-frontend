import { Result, VoidResponse } from "./common";

export type SignUpReq = {
  body: {
    email: string;
    user_name: string;
    password: string;
  };
};

export type SignUpRes = VoidResponse;

export type SignInReq = {
  body: {
    email: string;
    password: string;
    is_stay_login: boolean;
  };
};

export type SignInRes = {
  message: string;
  result: Result;
  data: {
    user: {
      email: string;
      user_name: string;
      img: string;
    };
    token: string;
  };
};
