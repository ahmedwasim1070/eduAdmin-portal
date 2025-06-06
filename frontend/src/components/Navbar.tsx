// React
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Axios custom API
import axiosInstance from "../api/axios";
// Auth zustand
import { useAuthStore } from "../store/useAuthStore";

// Icons
import { LogOut, Settings } from "lucide-react";

// Component Loader
import { MainLoader } from "./Loader";

// Props for navbar
type NavbarProps = {
  userRole: string;
};

function Navbar({ userRole }: NavbarProps) {
  // User data
  const { setAuthUser } = useAuthStore();

  // Navigation
  const navigate = useNavigate();
  // Loader's
  const [isLoginOut, setIsLoginOut] = useState(false);

  // Handles Logout
  const handleLogout = async () => {
    // Enables Loader
    setIsLoginOut(true);
    try {
      const res = await axiosInstance.get("auth/logout");

      if (res.status) {
        // dismiss previous notificaiton
        toast.dismiss();
        // sucess message
        toast.success(res.data.message);
        // resets auth user
        setAuthUser(null);
        // Navigates to login page
        navigate("/login");
      }
    } catch (error) {
    } finally {
      // Disables Loader
      setIsLoginOut(false);
    }
  };
  return (
    <>
      <nav className="min-w-screen min-h-16 max-h-22 flex flex-row justify-between items-center px-4 shadow bg-gray-50">
        {/* Loader */}
        {isLoginOut && <MainLoader />}

        {/* Left */}
        <div className="flex flex-row gap-x-1 items-end justify-center">
          <h1 className="text-textColor font-bold text-xl cursor-pointer">
            <Link to="/">Dashboard</Link>
          </h1>
          <p className="bg-secondaryColor rounded-full px-2 text-sm text-textColor">
            {userRole}
          </p>
        </div>
        {/*  */}

        {/* Right */}
        <div className="flex flex-row items-center justify-center gap-x-3">
          {/* Button Primary */}
          <button className=" p-2 rounded-full cursor-pointer duration-100 hover:bg-gray-300">
            <Settings className="w-5 h-5" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex flex-row items-center justify-center gap-x-2 bg-red-300 px-4 py-1.5 rounded-md border border-red-600 cursor-pointer duration-100 hover:bg-red-200"
          >
            {/* Content */}
            <p className="text-red-800">Logout</p>
            {/* Logout Button */}
            <LogOut className="w-4 h-4 text-red-700" />
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
