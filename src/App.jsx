// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Post from "./pages/Post";
import CreatePost from "./pages/CreatePost";
import FollowersFollowings from "./pages/FollowersFollowings";
import Chatroom from "./pages/Chatroom";
import { Box } from "@mui/material";
import Register from "./pages/SignUp";
import Login from "./pages/SignIn";
import { apiUrl, AppContext, useApp } from "./useApp";
import { useEffect, useState } from "react";

function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated } = useApp();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token);
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return null; // or loading spinner
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
}

function PreventAuth({ children }) {
  const { isAuthenticated, setIsAuthenticated } = useApp();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token);
  }, [isAuthenticated]);

  if (isAuthenticated === null) return null;

  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // setting current user
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${apiUrl}/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }).then(async (res) => {
        const data = await res.json();
        setCurrentUser(data);
      });
    }
  }, [isAuthenticated]);

  return (
    <>
      <AppContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
          currentUser,
          setCurrentUser,
        }}
      >
        <Sidebar />
        <Box sx={{ ml: { xs: 0, md: 10 }, pt: 2 }}>
          <Routes>
            <Route
              path="/signin"
              element={
                <PreventAuth>
                  <Login />
                </PreventAuth>
              }
            />
            <Route
              path="/signup"
              element={
                <PreventAuth>
                  <Register />
                </PreventAuth>
              }
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route
              path="/post/:id"
              element={
                <RequireAuth>
                  <Post />
                </RequireAuth>
              }
            />
            <Route
              path="/create-post"
              element={
                <RequireAuth>
                  <CreatePost />
                </RequireAuth>
              }
            />
            <Route
              path="/follow"
              element={
                <RequireAuth>
                  <FollowersFollowings />
                </RequireAuth>
              }
            />
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <RequireAuth>
                  <Chatroom />
                </RequireAuth>
              }
            />
            {/* Catch-all route: redirect unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </AppContext.Provider>
    </>
  );
}
