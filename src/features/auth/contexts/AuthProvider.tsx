import React, { useEffect, useState } from "react";
import type { AuthUser } from "../types";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        const fetchedUser: AuthUser = JSON.parse(storedUser);
        setUser(fetchedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const login = (user: AuthUser, token: string) => {
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token); // 👈 store token here
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
