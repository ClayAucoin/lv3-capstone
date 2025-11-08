// src/components/AddUser.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import UserForm from "./UserForm";

export default function AddUser() {
  // setup redirect
  const navigate = useNavigate();

  // setup sate variables
  const [isTesting, setIsTesting] = useState("");
  const [defaultValues, setDefaultValues] = useState({
    is_active: true,
    is_admin: false,
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // change for testing or not
    setIsTesting(true);

    if (isTesting) {
      setDefaultValues({
        is_active: true,
        is_admin: false,
        first_name: "Bob",
        last_name: "Hardy",
        username: "HardyBob",
        email: "bob@hardy.com",
        password: "1",
        confirmPassword: "1",
      });
    }
  }, [isTesting]);

  async function handleAddUser(payload) {
    const { error } = await supabase.from("users").insert(payload);
    if (error) {
      console.error("AddUser: handleAddUser: ", error.message);
    }
    navigate("/manage-users");
  }

  return (
    <UserForm
      mode="add"
      onSubmit={handleAddUser}
      title="Add User"
      initialValues={{
        is_active: defaultValues.is_active,
        is_admin: defaultValues.is_admin,
        first_name: defaultValues.first_name,
        last_name: defaultValues.last_name,
        username: defaultValues.username,
        email: defaultValues.email,
        password: defaultValues.password,
        confirmPassword: defaultValues.confirmPassword,
      }}
    />
  );
}
