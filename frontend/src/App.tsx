import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.ts";
import { useEffect } from "react";

import HomePage from "./pages/HomePage.tsx";
import SignupPage from "./pages/SignupPage.tsx";

const App = () => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/signup" />}
        ></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
