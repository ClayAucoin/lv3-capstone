/* eslint-disable react-hooks/rules-of-hooks */

// src/components/ManageUsers.jsx

// import react hooks and  components
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";

// import supabase config
import supabase from "../../utils/supabase";

// import images
import refreshImg from "../../images/refresh.png";
import editButton from "../../images/edit.jpg";
import trashCan from "../../images/trash.png";

// import modal
import NoticeModal from "../NoticeModal";

// import css
import "./ManageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [nonAdminUsers, setNonAdminUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [nonAdminUsers2, setNonAdminUsers2] = useState([]);
  const [adminUsers2, setAdminUsers2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ show: false, user: null });

  // populate logged in user from authcontext
  const { user } = useAuth();
  if (!user || user.is_admin == false) return <Navigate to="/login" replace />;

  // console.log("ManageUsers: user: ", user);

  // refreshImg users for table
  async function refreshUsers() {
    setLoading(true);
    const { data: users, error } = await supabase
      .from("users")
      .select()
      .order("first_name");

    if (error) {
      console.error("refreshUsers error: ", error);
    }
    setUsers(users || []);
    setLoading(false);

    console.log("users: ", users);
  }

  async function refreshAdminUsers(isAdmin) {
    const flag = isAdmin === true || isAdmin === "true";
    setLoading(true);

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("is_admin", isAdmin)
      .order("first_name");

    if (error) {
      console.error("refreshUsers error: ", error);
      setLoading(false);
      return;
    }

    // console.log("refreshAdminUsers returned: ", users);

    if (flag) {
      console.log("if: isAdmin");
      setAdminUsers(users || []);
    } else {
      console.log("if: !isAdmin");
      setNonAdminUsers(users || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    refreshUsers();
    refreshAdminUsers(true);
    refreshAdminUsers(false);
  }, []);

  // modal confirmations
  function askDeleteUser(user) {
    console.log("askDeleteUser: ", user);
    setConfirm({ show: true, user });
  }
  function closeConfirm() {
    setConfirm({ show: false, user: null });
  }

  // delete user
  async function confirmDelete() {
    const id = confirm.user?.id;
    console.log(`confirmDelete - Deleting: ${id}, typeof: ${typeof id}`);

    if (!id) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Delete failed: ", error);
      await refreshUsers();
    }
    closeConfirm();
  }

  // is admin or not way 2
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, is_admin")
        .order("first_name");

      if (error) {
        console.error("load users error:", error);
        setLoading(false);
        return;
      }

      const admins = (data || []).filter((u) => u.is_admin === true);
      const nonAdmins = (data || []).filter((u) => u.is_admin !== true);

      setAdminUsers2(admins);
      setNonAdminUsers2(nonAdmins);
      setLoading(false);
      console.log("setAdminUsers2 returned: ", admins);
      console.log("setNonAdminUsers2 returned: ", nonAdmins);
    })();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          {loading && (
            <div className="refresh-overlay">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between text-end">
            <span></span>
            <img
              src={refreshImg}
              alt="Refresh"
              className="refresh"
              onClick={refreshUsers}
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                {/* <th scope="col">ID</th> */}
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col" className="ckBoxCol">
                  Active
                </th>
                <th scope="col" className="ckBoxCol">
                  Admin
                </th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  {/* <td className="col">{user.id}</td> */}
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className="ckBoxCol">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked={user.is_active}
                      readOnly
                    />
                  </td>
                  <td className="ckBoxCol">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked={user.is_admin}
                      readOnly
                    />
                  </td>
                  <td className="ckBoxCol">
                    <Link to={`/edit-user/${user.id}`}>
                      <img src={editButton} alt="Edit" className="icon" />
                    </Link>
                  </td>
                  <td className="ckBoxCol">
                    <img
                      src={trashCan}
                      alt="Delete"
                      className="icon"
                      onClick={() => askDeleteUser(user)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-end">
            <div className="text-center" style={{ width: "150px" }}>
              <Link to="/add-user/">
                <button
                  aria-label="Add User"
                  className="btn btn-primary btn-sm for-form"
                >
                  Add User
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <NoticeModal
        show={confirm.show}
        title="Delete user?"
        variant="danger"
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      >
        You are about to delete{" "}
        <b>
          {confirm.user?.first_name} {confirm.user?.last_name}
        </b>{" "}
        ({confirm.user?.username}). This action cannot be undone.
      </NoticeModal>
    </>
  );
}
