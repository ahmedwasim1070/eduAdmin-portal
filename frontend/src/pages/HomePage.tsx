import { useState } from "react";

// Components
import { Navbar } from "../components/Dashboard/Navbar";
import { DashboardSetting } from "../components/Dashboard/DashboardSettings";
import { RootDashboard } from "../components/Dashboard/RootDashboard";

function HomePage() {
  // Windows
  const [isSetting, setIsSetting] = useState(false);
  const [confirmSuspension, setConfirmSupsension] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  return (
    <>
      <div className="min-h-screen">
        {isSetting && <DashboardSetting setIsSetting={setIsSetting} />}

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
                  }}
                  className="text-blue-500 cursor-pointer duration-100 hover:bg-blue-100 rounded-full px-2"
                >
                  Cancel
                </button>
                <button className="text-red-500 cursor-pointer duration-100 hover:bg-red-100 rounded-full px-2">
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
                  }}
                  className="text-blue-500 cursor-pointer duration-100 hover:bg-blue-100 rounded-full px-2"
                >
                  Cancel
                </button>
                <button className="text-red-500 cursor-pointer duration-100 hover:bg-red-100 rounded-full px-2">
                  Suspend
                </button>
              </div>
            </div>
          </div>
        )}

        <Navbar setIsSetting={setIsSetting} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info */}
          <RootDashboard />
        </main>
      </div>
    </>
  );
}

export default HomePage;
