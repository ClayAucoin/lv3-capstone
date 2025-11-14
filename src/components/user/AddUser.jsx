// src/components/AddUser.jsx

// import react hooks and components
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// import supabase config
import supabase from "../../utils/supabase";

// import css
import UserForm from "./UserForm";

export default function AddUser() {
  const navigate = useNavigate();

  const [isTesting, setIsTesting] = useState(false);
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
    document.title = `AddUser`;
  }, []);

  useEffect(() => {
    // change for testing or not
    setIsTesting(true);
    // setIsTesting(false);

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

  // insert new user into dB
  async function handleAddUser(payload) {
    try {
      const { error } = await supabase.from("users").insert(payload);
      if (error) {
        console.error("AddUser: handleAddUser: ", error.message);
      }
      navigate("/manage-users");
    } catch (err) {
      console.log("AddUser: handleAddUser: unexpected error: ", err);
    }
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
