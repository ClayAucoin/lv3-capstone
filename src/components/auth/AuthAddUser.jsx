// src/components/auth/AuthAddUser.jsx
// happyv
// rudolph

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import supabase from "../../utils/supabase";

export default function AuthAddUser() {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function addUser(email, password) {
    // Sign in
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    // console.log("addUser: ", email, password);
    // console.log(data);
    return { user: data.user, error };
  }

  async function handleAddUser(event) {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    console.log("handle login: ", email, password);
    const { user, error } = await addUser(email, password);

    if (error) {
      console.log("addUser error: ", error);
      return;
    }
    // setUsername(user);
    // loginComplete(user, error);
  }

  return (
    <div className="container mt-4 login-container">
      <div className="card">
        <div className="card-body">
          <h3 className="w-100 text-center">Add User</h3>
          <form onSubmit={handleAddUser}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
                <input
                  id="email"
                  type="email"
                  className="form-control form-control-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </label>
            </div>
            <div className="">
              <label htmlFor="password" className="form-label">
                Password
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
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
            <button type="type" className="btn btn-primary for-form">
              Add User
            </button>
            <Link to="/auth-login">
              <button className="btn btn-primary for-form mt-2">Cancel</button>
            </Link>
          </form>

          {/* <NoticeModal
              show={modal.show}
              title={modal.title}
              message={modal.message}
              variant={modal.variant}
              onClose={closeNotice}
            /> */}
        </div>
      </div>
    </div>
  );
}
