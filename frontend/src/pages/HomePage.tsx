import { useAuthStore } from "../store/useAuthStore";
import { ScrollText, Plus } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useState } from "react";

import { DashboardSetting } from "../components/DashboardSettings";

function HomePage() {
  const { authUser } = useAuthStore();

  const [isSetting, setIsSetting] = useState(false);

  return (
    <>
      <section className="min-h-screen">
        {isSetting && <DashboardSetting setIsSetting={setIsSetting} />}

        <Navbar setIsSetting={setIsSetting} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info */}
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-textColor text-lg font-medium mb-4">
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-primaryColor">Full Name</p>
                <p className="font-medium">{authUser.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-primaryColor">Email</p>
                <p className="font-medium">{authUser.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-primaryColor">Contact</p>
                <p className="font-medium">{authUser.contactNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-primaryColor">Status</p>
                <p className="font-medium">{authUser.status || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-primaryColor">Role</p>
                <p className="font-medium">{authUser.role || "N/A"}</p>
              </div>
            </div>
          </div>

          {authUser.role === "root" && (
            <div className="mb-8 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <h2 className="text-textColor text-lg font-medium">Root User</h2>
              <div className="flex justify-center items-center gap-x-4">
                <button className="flex items-center gap-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer">
                  <Plus className="w-4 h-4 " />
                  Add User
                </button>
                <button className="flex items-center gap-x-2 px-3 py-1 bg-secondaryColor text-textColor rounded-md hover:bg-secondaryColor/60 cursor-pointer">
                  <ScrollText className="w-4 h-4" />
                  List Users
                </button>
              </div>
            </div>
          )}

          {authUser.role === "root" && (
            <div className="mb-8 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <h2 className="text-textColor text-lg font-medium">Colleges</h2>
              <div className="flex justify-center items-center gap-x-4">
                <button className="flex items-center gap-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer">
                  <Plus className="w-4 h-4 " />
                  Add College
                </button>
                <button className="flex items-center gap-x-2 px-3 py-1 bg-secondaryColor text-textColor rounded-md hover:bg-secondaryColor/60 cursor-pointer">
                  <ScrollText className="w-4 h-4" />
                  List Colleges
                </button>
              </div>
            </div>
          )}
        </main>
      </section>
    </>
  );
}

export default HomePage;
