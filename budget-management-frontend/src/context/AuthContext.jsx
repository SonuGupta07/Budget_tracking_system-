import { createContext, useState } from "react";
import { loginUser } from "../api/authApi";
import {
  setToken,
  setTokenType,
  getToken,
  setUser,
  getUser,
  clearAuthStorage,
} from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setAuthUser] = useState(getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));
  const [loading, setLoading] = useState(false);

  const login = async (loginData) => {
    setLoading(true);

    try {
      const response = await loginUser(loginData);

      if (!response.access_token) {
        throw new Error("Access token not received from backend");
      }

      setToken(response.access_token);
      setTokenType(response.token_type || "bearer");

      const userData = {
          email: loginData.email,
          role:response?.role || response?.user?.role || "ROLE_USER"
      };

      setUser(userData);
      setAuthUser(userData);
      setIsAuthenticated(true);

      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthStorage();
    setAuthUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
