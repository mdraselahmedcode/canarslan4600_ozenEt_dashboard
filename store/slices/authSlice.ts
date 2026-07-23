import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

// Safely access localStorage on the client side
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorageItem = (key: string, value: string | null) => {
  if (typeof window !== "undefined") {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }
};

const initialState: AuthState = {
  accessToken: getLocalStorageItem("accessToken"),
  refreshToken: getLocalStorageItem("refreshToken"),
  role: getLocalStorageItem("role"),
  isAuthenticated: !!getLocalStorageItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        role: string;
      }>
    ) => {
      const { accessToken, refreshToken, role } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.role = role;
      state.isAuthenticated = true;

      setLocalStorageItem("accessToken", accessToken);
      setLocalStorageItem("refreshToken", refreshToken);
      setLocalStorageItem("role", role);
    },
    updateAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      setLocalStorageItem("accessToken", accessToken);
    },
    logOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.isAuthenticated = false;

      setLocalStorageItem("accessToken", null);
      setLocalStorageItem("refreshToken", null);
      setLocalStorageItem("role", null);
    },
  },
});

export const { setCredentials, updateAccessToken, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectCurrentRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectCurrentRole = (state: { auth: AuthState }) => state.auth.role;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
