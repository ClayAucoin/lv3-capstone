//* eslint-disable react-hooks/rules-of-hooks */
// src/components/UserForm.jsx

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NoticeModal from "../NoticeModal";
import "./UserForm.css";

export default function UserForm({
  mode = "add",
  initialValues,
  onSubmit,
  title = mode === "add" ? "Add User" : "Edit User",
}) {
  const [form, setForm] = useState({
    is_active: true,
    is_admin: false,
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    ...initialValues, // edit mode will prefill these
  });

  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    variant: "danger",
  });

  const { user } = useAuth();
  // if (!user) return <Navigate to="/login" replace />;

  const location = useLocation();
  const basePath = location.pathname
    .replace(/^((?:\/[^/]+){1}).*$/, "$1")
    .replace(/\/$/, "");

  console.log("user: ", user);
  console.log("basePath: ", basePath);

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  function showNotice(title, message, variant = "danger") {
    setModal({ show: true, title, message, variant });
  }

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Basic validation
    if (!form.first_name) {
      return showNotice("Validation", "First name is required.", "warning");
    }
    if (!form.last_name) {
      return showNotice("Validation", "Last name is required.", "warning");
    }
    if (!form.username) {
      return showNotice("Validation", "Username is required.", "warning");
    }
    if (!form.email) {
      return showNotice("Validation", "Email is required.", "warning");
    }

    // password rules:
    // - in ADD mode, password is required and must match
    // - in EDIT mode, password is optional; if provided, must match
    if (mode === "add") {
      if (!form.password)
        return showNotice("Validation", "Password is required.", "warning");
      if (form.password !== form.confirmPassword)
        return showNotice("Validation", "Passwords do not match.", "warning");
    } else {
      if (form.password || form.confirmPassword) {
        if (form.password !== form.confirmPassword)
          return showNotice("Validation", "Passwords do not match.", "warning");
      }
    }

    // build payload, omit password in EDIT if left blank
    const payload = {
      is_active: !!form.is_active,
      is_admin: !!form.is_admin,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      ...(form.password ? { password: form.password } : {}),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      showNotice("Save Error", err.message || "Could not save user.", "danger");
    }
  }

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <header className="m-0 p-0">
          <table className="table user-form table-borderless table-no-padding">
            <tbody className="user-form">
              <tr className="user-form">
                <td colSpan="2" className="centered user-form">
                  <h1 className="align-self-center">{title}</h1>
                </td>
              </tr>
              <tr className="user-form">
                <td className="user-form">
                  {user && (
                    <Link to="/manage-users">
                      <button className="btn btn-primary my-button">
                        ← User List
                      </button>
                    </Link>
                  )}
                </td>
                <td className="user-form d-flex align-items-end">
                  <div className="row button-ckbox righted">
                    <div className="col-6 p-0">
                      <div className="align-self-start align-items-start"></div>
                    </div>
                    <div className="col-6 p-0">
                      <div className="d-flex justify-content-end">
                        <label className="form-label">
                          Activate:&nbsp;
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="is_active"
                            defaultChecked={!!form.is_active}
                            onChange={(e) =>
                              updateField("is_active", e.target.checked)
                            }
                          />
                        </label>
                      </div>
                      <div className="d-flex justify-content-end">
                        {user?.is_admin && (
                          <label className="form-label">
                            Admin:&nbsp;
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="is_admin"
                              defaultChecked={!!form.is_admin}
                              onChange={(e) =>
                                updateField("is_admin", e.target.checked)
                              }
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </header>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">First Name</label>
            <input
              className="form-control"
              value={form.first_name}
              onChange={(e) => updateField("first_name", e.target.value)}
              autoFocus
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Last Name</label>
            <input
              className="form-control"
              value={form.last_name}
              onChange={(e) => updateField("last_name", e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <label className="form-label">
              Password{mode === "edit" ? " (optional)" : ""}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={form.password || ""}
              onChange={(e) => updateField("password", e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="col-6">
            <label className="form-label">
              Confirm Password{mode === "edit" ? " (optional)" : ""}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={form.confirmPassword || ""}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="showPassword"
            defaultChecked={showPassword}
            onChange={() => setShowPassword((show) => !show)}
          />
          <label className="form-check-label" htmlFor="showPassword">
            Show password
          </label>
        </div>

        <div className="d-flex justify-content-end">
          <div className="bot-button-div mx-1">
            <Link to={user ? "/manage-users" : "/login"}>
              <button className="btn btn-primary btn-sm for-form">
                Cancel
              </button>
            </Link>
          </div>
          <div className="bot-button-div ms-1">
            <button className="btn btn-primary btn-sm for-form" type="submit">
              {mode === "add" ? "Add User" : "Update User"}
            </button>
          </div>
        </div>
      </form>

      <NoticeModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        variant={modal.variant}
        onClose={() => setModal((m) => ({ ...m, show: false }))}
      />
    </div>
  );
}
