import { Result } from "../response";

export type UpdateProfileRequest = {
  body: {
    firstName: string;
    lastName: string;
    email: string;
  };
};
export type UpdateProfileResponse = {
  result: Result;
  message?: string;
};
