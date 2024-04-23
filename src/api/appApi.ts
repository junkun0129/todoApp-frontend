import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "../store/store";
import { setLogout } from "../slice/authSlice";

// ==============================|| Base Query ||============================== //
const BASE_URL = import.meta.env.VITE_API_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).persistedReducer.AuthReducer.token;
    
    if (token !== "") {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

type BaseQueryType = ReturnType<typeof fetchBaseQuery>;

export const baseQueryWithReauth: (baseQuery: BaseQueryType) => BaseQueryType =
  (baseQuery) => async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // 401 Unauthorized
      // console.log('Unauthorized :>> ', result);
      api.dispatch(setLogout());
      // api.dispatch(setForceRedirectLocation(''));
    }

    if (result.error && result.error.status === 403) {
      // 403 forbidden
    }

    return result;
  };

// --------file------------------
export const baseQueryFile = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).persistedReducer.AuthReducer.token;
    console.log(token);
    console.log("object");
    if (token !== "") {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "multipart/form-data");
    return headers;
  },
});

export const baseQueryWithReauthFile: (
  baseQuery: BaseQueryType
) => BaseQueryType = (baseQuery) => async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // 401 Unauthorized
    // console.log('Unauthorized :>> ', result);
    api.dispatch(setLogout());
    // api.dispatch(setForceRedirectLocation(''));
  }

  if (result.error && result.error.status === 403) {
    // 403 forbidden
  }

  return result;
};
