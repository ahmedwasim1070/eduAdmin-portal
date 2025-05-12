import { useState } from "react";
import toast from "react-hot-toast";

// Zustand
import { useAuthStore } from "../store/useAuthStore";

// Components
import { Navbar } from "../components/Dashboard/Navbar";
import { DashboardSetting } from "../components/Dashboard/DashboardSettings";
import { Signup } from "../components/Forms/Signup";
import { axiosInstance } from "../lib/axios";

function HomePage() {
  const { authUser } = useAuthStore();

  // Performed Action on User Id
  const [actionOn, setActionOn] = useState("");
  // Refetch Users
  // Windows
  const [isSetting, setIsSetting] = useState(false);
  const [isRootSignup, setIsRootSignup] = useState(false);
  const [isRegisterCollege, setIsRegisterCollege] = useState(false);
  const [confirmSuspension, setConfirmSupsension] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  // Handle User Deletion Request
  const handleStatusChange = async () => {
    try {
      if (confirmSuspension || confirmDeletion) {
        const result = await axiosInstance.post("/user/change/status", {
          statusType: confirmDeletion
            ? "deleted"
            : confirmSuspension
            ? "suspended"
            : undefined,
          actionOn,
        });

        if (result.status === 200) {
          setActionOn("");
          toast.success(result.data.message);
        } else {
          toast.error(result.data.message);
        }
      }
    } catch (error) {
      console.error("Error in Fetct API :", error);
      toast.error("Connection Error !");
    } finally {
      setConfirmDeletion(false);
      setConfirmSupsension(false);
    }
  };
  return (
    <>
      <section className="min-h-screen">
        {isSetting && <DashboardSetting setIsSetting={setIsSetting} />}

        {/* Signup Page for Root User */}
        {authUser.role === "root" && isRootSignup && (
          <div className="fixed w-full min-h-screen flex justify-center items-center bg-white/20 backdrop-blur-sm z-50">
            <Signup
              role="root"
              componentType="Add Root User"
              setCloseForm={setIsRootSignup}
            />
          </div>
        )}

        {/* Registration for College (Principle Signup) */}
        {authUser.role === "root" && isRegisterCollege && (
          <div className="fixed w-full min-h-screen flex justify-center items-center bg-white/20 backdrop-blur-sm z-50">
            <Signup
              role="principal"
              componentType="Register College"
              setCloseForm={setIsRegisterCollege}
            />
          </div>
        )}

        {/* Confirm Deletion */}
        {confirmDeletion && (
          <div className="fixed w-full min-h-screen flex justify-center items-center bg-white/20 backdrop-blur-sm z-50">
            <div className="w-[15%] h-40 relative bg-gray-100 rounded-xl border border-black/20 shadow-2xl text-center pt-4">
              <p className="text-lg font-medium text-primaryColor">
                Are You Sure
              </p>
              <p className="py-3 text-black/80">
                This action will delete a user
              </p>
              <div className="absolute bottom-0 w-full flex flex-row rounded-b-xl ite-center justify-evenly overflow-hidden py-3 border-t-1 border-black/20">
                {/* Cancel */}
                <button
                  onClick={() => {
                    setConfirmDeletion(false);
                    setActionOn("");
                  }}
                  className="text-blue-500 cursor-pointer duration-100 hover:bg-blue-100 rounded-full px-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  className="text-red-500 cursor-pointer duration-100 hover:bg-red-100 rounded-full px-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Confirm Suspension */}
        {confirmSuspension && (
          <div className="fixed w-full min-h-screen flex justify-center items-center bg-white/20 backdrop-blur-sm z-50">
            <div className="w-[15%] h-40 relative bg-gray-100 rounded-xl border border-black/20 shadow-2xl text-center pt-4">
              <p className="text-lg font-medium text-primaryColor">
                Are You Sure
              </p>
              <p className="py-3 text-black/80">
                This action will Suspend a user
              </p>
              <div className="absolute bottom-0 w-full flex flex-row rounded-b-xl ite-center justify-evenly overflow-hidden py-3 border-t-1 border-black/20">
                {/* Cancel */}
                <button
                  onClick={() => {
                    setConfirmSupsension(false);
                    setActionOn("");
                  }}
                  className="text-blue-500 cursor-pointer duration-100 hover:bg-blue-100 rounded-full px-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  className="text-red-500 cursor-pointer duration-100 hover:bg-red-100 rounded-full px-2"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        )}

        <Navbar setIsSetting={setIsSetting} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info */}
        </main>
      </section>
    </>
  );
}

export default HomePage;
