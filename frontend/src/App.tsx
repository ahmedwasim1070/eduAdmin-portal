// React router dom
import { Navigate, Route, Routes } from "react-router-dom";

// React hot toast
import { Toaster } from "react-hot-toast";

// Zustand Auth Store
import { useAuthStore } from "./store/useAuthStore.ts";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.tsx";
import BaseSignupPage from "./pages/BaseSignupPage.tsx";

function App() {
  // Imports for zustand
  const { authUser } = useAuthStore();

  return (
    <>
      <div id="app">
        {/* Notification Toaster */}
        <Toaster />

        {/* Routes  */}
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          {/* Login  Page */}
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <LoginPage />}
          />
          {/* Base Signup Page */}
          <Route
            path="/base/root/signup"
            element={authUser ? <Navigate to="/" /> : <BaseSignupPage />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
