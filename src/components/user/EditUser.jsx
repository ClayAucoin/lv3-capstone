// src/components/EditUser.jsx

// import react hooks and components
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// import supabase config
import supabase from "../../utils/supabase";

// import css
import UserForm from "./UserForm";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);

  // get current user's info from dB and populate form
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        setInitial({
          is_active: data.is_active,
          is_admin: data.is_admin,
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          email: data.email,
          password: "",
          confirmPassword: "",
        });
      }
    })();
  }, [id]);

  // update user info
  async function handleUpdate(payload) {
    try {
      // omit password if blank
      const update = { ...payload };
      if (!update.password) delete update.password;

      const { error } = await supabase
        .from("users")
        .update(update)
        .eq("id", Number(id));

      if (error) {
        console.log("AddUser: handleUpdate: ", error);
      }
      navigate("/manage-users");
    } catch (err) {
      console.log("AddUser: handleUpdate: unexpected error: ", err);
    }
  }

  if (!initial) return <p>Loading user...</p>;

  return (
    <UserForm
      mode="edit"
      onSubmit={handleUpdate}
      title="Edit User"
      initialValues={initial}
    />
  );
}
