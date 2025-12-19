"use client";

import { createContext, useEffect, useState } from "react";
import api from "@/lib/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------
  // LOAD USER FROM LOCAL STORAGE
  // ----------------------------------
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Auth load error:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------
  // LOGIN
  // ----------------------------------
  const loginUser = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      const { user, token } = res.data;

      if (!token || !user) {
        return { success: false, message: "Invalid response from server" };
      }

      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // redirect incomplete profile
      // if (!user.isCompleted && user.role !== "admin") {
      //   window.location.href = "/";
      // }

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // REGISTER
  // ----------------------------------
  const registerUser = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        username: name,
        email,
        password,
      });

      const { user, token } = res.data;

      if (!token || !user) {
        return { success: false, message: "Registration failed" };
      }

      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // LOGOUT
  // ----------------------------------
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
