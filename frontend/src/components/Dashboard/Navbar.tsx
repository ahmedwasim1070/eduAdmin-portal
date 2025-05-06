import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Settings } from "lucide-react";

type NavbarProps = {
  setIsSetting: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Navbar = ({ setIsSetting }: NavbarProps) => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  // Logouts  Function
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success(result.message);
      navigate("/login");
    } else {
      toast.error(result.message);
    }
  };
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-textColor">Dashboard</h1>
            <div className="ml-4 px-3 py-1 bg-secondaryColor text-textColor rounded-full text-sm font-medium">
              {authUser.role}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSetting(true)}
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-secondaryColor text-textColor rounded-md hover:bg-red-100 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
