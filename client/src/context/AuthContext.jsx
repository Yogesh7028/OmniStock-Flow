import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import authApi from "../api/authApi";
import { clearAuthState, setAuthState } from "../features/auth/authSlice";

const AuthContext = createContext(null);

export const roleHome = {
  ADMIN: "/admin",
  STORE_MANAGER: "/store",
  WAREHOUSE_MANAGER: "/warehouse",
  SUPPLIER: "/supplier",
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("omnistock_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("omnistock_user");
    return null;
  }
};

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem("omnistock_access_token"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("omnistock_access_token")));

  const persistAuth = useCallback((authData) => {
    const nextToken = authData.token || authData.accessToken;
    const nextUser = authData.user;

    localStorage.setItem("omnistock_access_token", nextToken);
    localStorage.setItem("omnistock_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    dispatch(setAuthState({ user: nextUser, accessToken: nextToken }));
    return nextUser;
  }, [dispatch]);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("omnistock_access_token");
    localStorage.removeItem("omnistock_refresh_token");
    localStorage.removeItem("omnistock_user");
    setToken(null);
    setUser(null);
    dispatch(clearAuthState());
  }, [dispatch]);

  const refreshMe = useCallback(async () => {
    if (!localStorage.getItem("omnistock_access_token")) {
      setLoading(false);
      return null;
    }

    try {
      const response = await authApi.me();
      const nextUser = response.data.user || response.data;
      localStorage.setItem("omnistock_user", JSON.stringify(nextUser));
      setUser(nextUser);
      dispatch(
        setAuthState({
          user: nextUser,
          accessToken: localStorage.getItem("omnistock_access_token"),
        })
      );
      return nextUser;
    } catch {
      clearAuth();
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearAuth, dispatch]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      register: authApi.register,
      verifyOtp: authApi.verifyOtp,
      resendOtp: authApi.resendOtp,
      forgotPassword: authApi.forgotPassword,
      resetPassword: authApi.resetPassword,
      login: async (payload) => {
        const response = await authApi.login(payload);
        return persistAuth(response.data);
      },
      logout: clearAuth,
      refreshMe,
    }),
    [clearAuth, loading, persistAuth, refreshMe, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
