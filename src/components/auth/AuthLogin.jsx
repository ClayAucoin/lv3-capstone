// src/components/auth/AuthLogin.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import supabase from "../../utils/supabase";

export default function AuthLogin() {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function signIn(email, password) {
    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log("handled");
    console.log(error);
    console.log(data);
    return { user: data.user, error };
  }

  async function handleLogin(event) {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    console.log("handle login");
    const { user, error } = await signIn(email, password);

    setUsername(user);
    // loginComplete(user, error);
  }

  return (
    <div className="container mt-4 login-container">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="btn btn-primary for-form">
              Log in
            </button>
            <Link to="/auth-add-user">
              <button className="btn btn-primary for-form mt-2">
                Create User
              </button>
            </Link>
            <Link to="/auth-delete-user">
              <button className="btn btn-primary for-form mt-2">
                Delete User
              </button>
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
