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

  // check for user data in localstorage on load
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    const storedFirstName = localStorage.getItem("first_name");
    const storedLastName = localStorage.getItem("last_name");
    const storedUser = localStorage.getItem("username");
    const storedIsActive = localStorage.getItem("is_active") === true;
    const storedIsAdmin = localStorage.getItem("is_admin") === true;
    if (storedUser && storedUserId) {
      setUser({
        id: storedUserId,
        first_name: storedFirstName,
        last_name: storedLastName,
        username: storedUser,
        is_active: storedIsActive,
        is_admin: storedIsAdmin,
      });
    }
    setIsLoading(false);
  }, []);

  // login user
  async function login(username, password) {
    try {
      // check if user exists in users table
      const { data: userData, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, username, is_active, is_admin")
        .eq("username", username.trim())
        .eq("password", password.trim())
        .maybeSingle();

      if (error) {
        console.error("login error:", error.message);
        return { user: null, error };
      }

      // console.log("AuthContext: login: ", userData);

      // populate localstorage if user exist
      if (userData) {
        localStorage.setItem("id", String(userData.id));
        localStorage.setItem("first_name", userData.first_name);
        localStorage.setItem("last_name", userData.last_name);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("is_active", userData.is_active);
        localStorage.setItem("is_admin", userData.is_admin);
        setUser(userData, error);

        // console.log("AuthContext: userData: ", userData);
        return { user: userData, error };
      }

      return { user: null, error: { message: "No matching user found" } };
    } catch (err) {
      console.log("login: unexpected error: ", err);
    }
  }

  // popup modal verifying if user wants to logout
  async function requestLogout() {
    const ok = await showModal({
      title: "Log out?",
      message: "Are you sure you want to log out?",
      variant: "warning",
      confirmText: "Log out",
      cancelText: "Cancel",
    });
    if (ok) logout();
  }

  // logout user
  function logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("username");
    localStorage.removeItem("is_active");
    localStorage.removeItem("is_admin");
    setUser(null);
    navigate("/login");
  }

  // temporary "loading" message
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // useAuth states
  const value = { user, setUser, logout, login, requestLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
