import { baseApi } from "./baseApi";

export interface LoginRequest {
  email: string;
  password?: string;
  playerId?: string;
  platform?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  role: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResendResetCodeRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  resetCode: number;
}

export interface ResetPasswordRequest {
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface ResetPasswordResponseData {
  accessToken: string;
  refreshToken: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse<null>, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forget-password",
        method: "POST",
        body,
      }),
    }),
    resendResetCode: builder.mutation<ApiResponse<null>, ResendResetCodeRequest>({
      query: (body) => ({
        url: "/auth/resend-reset-code",
        method: "POST",
        body,
      }),
    }),
    verifyResetOtp: builder.mutation<ApiResponse<null>, VerifyResetOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-reset-otp",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse<ResetPasswordResponseData>, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResendResetCodeMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} = authApi;
