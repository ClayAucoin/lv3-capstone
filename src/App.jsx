// src/App.jsx

// import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// protected routes
import ProtectedRoute from "./routes/ProtectedRoute";

// context providers
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";

// login
import LoginPage from "./components/LoginPage";

// user module pages
import ManageUsers from "./components/user/ManageUsers";
import EditUser from "./components/user/EditUser";
import AddUser from "./components/user/AddUser";

// media pages
import PickGenre from "./components/media/PickMovie";
import MovieView from "./components/media/MovieView";
import ViewWatchlist from "./components/media/ViewWatchlist";
import Analytics from "./components/media/Analytics";

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
