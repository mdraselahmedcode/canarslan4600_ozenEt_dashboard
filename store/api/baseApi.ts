import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logOut, updateAccessToken, AuthState } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: AuthState }).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If unauthorized, try to refresh token
  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as { auth: AuthState }).auth.refreshToken;

    if (refreshToken) {
      try {
        // Send refresh token request with token in both header and body for max compatibility
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const resData = refreshResult.data as {
            success: boolean;
            message?: string;
            data?: { accessToken: string };
          };

          if (resData.success && resData.data?.accessToken) {
            const newAccessToken = resData.data.accessToken;
            api.dispatch(updateAccessToken({ accessToken: newAccessToken }));
            
            // Retry the original query with the new access token
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logOut());
          }
        } else {
          api.dispatch(logOut());
        }
      } catch (err) {
        api.dispatch(logOut());
      }
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Category"],
  endpoints: () => ({}),
});
