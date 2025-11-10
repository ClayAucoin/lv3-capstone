/* eslint-disable react-refresh/only-export-components */

// src/context/AuthContext.jsx

// import react hooks and  components
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "./ModalContext";

// import supabase config
import supabase from "../utils/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (storedUser && storedUserId) {
      setUser({ id: storedUserId, username: storedUser });
    }
    setIsLoading(false);
  }, []);

  async function login(username, password) {
    const { data: userData, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, username, email, is_active, is_admin")
      .eq("username", username.trim())
      .eq("password", password.trim())
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error.message);
      return { user: null, error };
    }

    // console.log("AuthContext: login: ", userData);

    if (userData) {
      localStorage.setItem("userId", String(userData.id));
      localStorage.setItem("username", userData.username);
      localStorage.setItem("is_admin", userData.is_admin);
      setUser(userData, error);

      // console.log("AuthContext: userData: ", userData);
      return { user: userData, error };
    }

    return { user: null, error: { message: "No matching user found" } };
  }

  function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("is_admin");
    setUser(null);
    navigate("/login");
  }

  async function requestLogout() {
    // console.log("[Auth] requestLogout: opening modal");
    const ok = await showModal({
      title: "Log out?",
      message: "Are you sure you want to log out?",
      variant: "warning",
      confirmText: "Log out",
      cancelText: "Cancel",
    });
    // console.log("[Auth] requestLogout: result =", ok);
    if (ok) logout();
  }

  // temporary "loading" message
  if (isLoading) {
    return <p>Loading...</p>;
  }

  const value = { user, setUser, logout, login, requestLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
