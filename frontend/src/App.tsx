// React
import { useEffect } from "react";
// React router dom
import { Navigate, Route, Routes } from "react-router-dom";
// React hot toast
import { Toaster } from "react-hot-toast";

// Zustand Auth Store
import { useAuthStore } from "./store/useAuthStore.ts";

// Components
import { MainLoader } from "./components/Loader.tsx";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.tsx";
import BaseSignupPage from "./pages/BaseSignupPage.tsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";
import ForgetPassPage from "./pages/ForgetPassPage.tsx";

function App() {
  // Imports for zustand
  const { isLoading, authUser, verifyToken } = useAuthStore();

  // Checks for token
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);
  return (
    <>
      <div id="app">
        {isLoading && <MainLoader />}
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

          {/* Verify Email Page */}
          <Route path="/verify/email" element={<VerifyEmailPage />} />

          {/* Forget Password Page */}
          <Route path="/forget/password" element={<ForgetPassPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
