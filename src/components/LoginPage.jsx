// src/components/LoginPage.jsx

// import react hooks and components
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// import modal
import NoticeModal from "./NoticeModal";

// import css
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    variant: "danger",
  });

  // handle explicit login from the form
  async function handleLogin(e) {
    e.preventDefault();
    // console.log("username: " + username);

    // check if username/password is blank
    if (!username.trim()) {
      showNotice("Login Error", "Please enter a valid username", "danger");
      return;
    }
    if (!password.trim()) {
      showNotice("Login Error", "Please enter a password", "danger");
      return;
    }

    setPassword("");
    setUsername("");

    const { user, error } = await login(username, password);

    // console.log("error: ", error);

    // handle errors
    if (error || !user) {
      showNotice("Login Error", "User not found", "danger");
      return;
    }
    if (!user.is_active) {
      showNotice("Login Error", "Account is inactive", "warning");
      return;
    }

    // if successful, redirect user to...
    navigate("/view-watchlist");
  }

  // modal helpers
  function showNotice(title, message, variant = "danger") {
    setModal({ show: true, title, message, variant });
  }
  function closeNotice() {
    setModal((m) => ({ ...m, show: false }));
    setPassword("");
  }

  return (
    <div className="container mt-4 login-container">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
                <input
                  id="username"
                  type="text"
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
            <Link to="/add-user">
              <button className="btn btn-primary for-form mt-2">
                Create User
              </button>
            </Link>
          </form>

          <NoticeModal
            show={modal.show}
            title={modal.title}
            message={modal.message}
            variant={modal.variant}
            onClose={closeNotice}
          />
        </div>
      </div>
    </div>
  );
}
