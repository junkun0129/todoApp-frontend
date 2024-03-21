import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryFile, baseQueryWithReauthFile } from "./appApi";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: baseQueryWithReauthFile(baseQueryFile),
  endpoints: (builder) => ({
    updateProfImage: builder.mutation<any, any>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        console.log(file);
        return {
          url: `/user/updimg`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useUpdateProfImageMutation } = fileApi;
