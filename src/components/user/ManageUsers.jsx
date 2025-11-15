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

  useEffect(() => {
    document.title = `ManageUsers`;
  }, []);

  // refreshImg users for table
  async function refreshUsers() {
    try {
      setLoading(true);

      const { data: users, error } = await supabase
        .from("users")
        .select()
        .order("first_name");

      if (error) {
        console.error("refreshUsers error: ", error);
        return;
      }

      const { data } = await supabase.from("users").select("*").eq("id", 1);

      // console.log("inside refresh:", data[0].is_admin, typeof data[0].is_admin);

      setUsers(users || []);
    } catch (err) {
      console.log("refreshUsers: unexpected error: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUsers();
  }, []);

  if (!user || !user.is_admin) return <Navigate to="/user-watchlist" replace />;

  // console.log("ManageUsers: user?.is_active", user?.is_active);
  // console.log(
  //   `ManageUsers: user?.is_active: ${
  //     user?.is_active
  //   }, typeof: ${typeof user?.is_active}`
  // );

  // modal confirmations
  function askDeleteUser(user) {
    // console.log("askDeleteUser: ", user);
    setConfirm({ show: true, user });
  }
  function closeConfirm() {
    setConfirm({ show: false, user: null });
  }

  // delete user
  async function confirmDelete() {
    try {
      const id = confirm.user?.id;

      // console.log(`confirmDelete - Deleting: ${id}, typeof: ${typeof id}`);

      if (!id) return;

      // Optimistic UI update
      setUsers((prev) => prev.filter((u) => u.id !== id));

      const { errorUser } = await supabase.from("users").delete().eq("id", id);
      const { errorWatchlist } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", id);

      if (errorUser) {
        console.error("confirmDelete user: delete failed: ", errorUser);
        await refreshUsers();
        return;
      }

      if (errorWatchlist) {
        console.error(
          "confirmDelete watchlist: delete failed: ",
          errorWatchlist
        );
        await refreshUsers();
        return;
      }

      closeConfirm();
    } catch (err) {
      console.log("confirmDelete: unexpected error: ", err);
    }
  }

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
                <th scope="col">ID</th>
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
                  <td className="col">{user.id}</td>
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
