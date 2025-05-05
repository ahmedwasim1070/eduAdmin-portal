import { useAuthStore } from "../store/useAuthStore";
import { ScrollText, Plus, X, Pencil, CircleHelp } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useState } from "react";

function HomePage() {
  const { authUser } = useAuthStore();

  const [isSetting, setIsSetting] = useState(false);

  return (
    <>
      <section className={`min-h-screen relative`}>
        {isSetting && (
          <div
            onClick={() => setIsSetting(false)}
            className="fixed inset-0 min-h-screen backdrop-blur-sm bg-white/10"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-1/2 left-1/2 w-1/2 h-[65%] -translate-x-1/2 -translate-y-1/2 bg-white border shadow-2xl border-black/20 rounded-xl flex flex-col items-center justify-around py-4 gap-y-10"
            >
              <button
                onClick={() => setIsSetting(false)}
                className="absolute right-2 top-2 cursor-pointer hover:bg-gray-300 rounded-full p-0.5 duration-75"
              >
                <X className="w-9 h-9 text-gray-600" />
              </button>
              <div>
                <h1 className="font-medium text-3xl text-textColor">
                  Settings
                </h1>
              </div>
              <div className="w-[80%] py-8 flex flex-col text-center">
                <hr className="border-gray-300" />
                <div className="px-6 py-4  flex flex-row justify-between">
                  <div className="">
                    <p className="text-textColor text-xl font-medium pt-2 pb-1">
                      Change Name
                    </p>
                    <p className="text-gray-600">{authUser.fullName}</p>
                  </div>
                  <div>
                    <button className="bg-secondaryColor px-2 py-3 rounded-lg border cursor-pointer group duration-75 border-textColor hover:bg-white">
                      <Pencil className="text-textColor group-hover:fill-secondaryColor" />
                    </button>
                  </div>
                </div>
                {/* Change Password */}
                <hr className="border-gray-300" />
                <div className="px-6 py-4  flex flex-row justify-between">
                  <div>
                    <p className="text-textColor text-xl font-medium pt-2 pb-1">
                      Change Password
                    </p>
                  </div>
                  <div>
                    <button className="bg-secondaryColor px-2 py-3 rounded-lg border cursor-pointer duration-75 border-textColor group hover:bg-white">
                      <Pencil className="text-textColor group-hover:fill-secondaryColor" />
                    </button>
                  </div>
                </div>
                {/* Forget Password */}
                <hr className="border-gray-300" />
                <div className="px-6 py-4  flex flex-row justify-between">
                  <div className="">
                    <p className="text-textColor text-xl font-medium pt-2 pb-1">
                      Forgoten Password
                    </p>
                  </div>
                  <div>
                    <button className="bg-primaryColor px-2 py-3 rounded-lg border group cursor-pointer duration-75 border-textColor hover:bg-white">
                      <span className="text-xl font-medium px-2 py-3 text-secondaryColor group-hover:text-textColor">
                        ?
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Footer  */}
              <div>
                <ul className="text-gray-500">
                  <li>
                    <a className=" underline hover:text-primaryColor" href="#">
                      Report Issue
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
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
