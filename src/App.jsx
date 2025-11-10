// src/App.jsx

// import react hooks and components
import { Routes, Route, Navigate } from "react-router-dom";

// import protected routes
import ProtectedRoute from "./routes/ProtectedRoute";

// import context providers
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";

// import navbar
import Navbar from "./components/Navbar";

// import login
import LoginPage from "./components/LoginPage";

// auth
import AuthLogin from "./components/auth/AuthLogin.jsx";
import AuthAddUser from "./components/auth/AuthAddUser.jsx";

// import user module pages
import ManageUsers from "./components/user/ManageUsers";
import EditUser from "./components/user/EditUser";
import AddUser from "./components/user/AddUser";

// import media pages
import PickGenre from "./components/media/PickMovie";
import MovieView from "./components/media/MovieView";
import ViewWatchlist from "./components/media/ViewWatchlist";
import Analytics from "./components/media/Analytics";

// import css
import "./App.css";

export default function App() {
  return (
    <>
      <div className="my-container">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <ModalProvider>
                <AuthProvider>
                  <Navbar />
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/login" replace />}
                    />
                    <Route path="/login" element={<LoginPage />} />

                    {/* auth login routes */}
                    <Route path="/auth-login/" element={<AuthLogin />} />
                    <Route
                      path="/auth-add-user"
                      element={
                        // <ProtectedRoute>
                        <AuthAddUser />
                        // </ProtectedRoute>
                      }
                    />

                    {/* user module routes */}
                    <Route path="/add-user/" element={<AddUser />} />
                    <Route
                      path="/manage-users"
                      element={
                        <ProtectedRoute>
                          <ManageUsers />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/edit-user/:id"
                      element={
                        <ProtectedRoute>
                          <EditUser />
                        </ProtectedRoute>
                      }
                    />
                    {/* media routes */}
                    <Route
                      path="/view-watchlist/"
                      element={
                        <ProtectedRoute>
                          <ViewWatchlist />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pick-movie/:genre?"
                      element={
                        <ProtectedRoute>
                          <PickGenre />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/movie-view/:imdbId/:genre?"
                      element={
                        <ProtectedRoute>
                          <MovieView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analytics/"
                      element={
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      }
                    />

                    {/* fallback route */}
                    <Route path="*" element={<LoginPage />} />
                  </Routes>
                </AuthProvider>
              </ModalProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
