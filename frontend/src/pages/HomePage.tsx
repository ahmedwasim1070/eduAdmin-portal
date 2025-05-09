import { useState } from "react";

import { useAuthStore } from "../store/useAuthStore";

// Components
import { Navbar } from "../components/Dashboard/Navbar";
import { DashboardSetting } from "../components/Dashboard/DashboardSettings";
import { UserInfoPanel } from "../components/Dashboard/UserInfoPanel";
import { ChildUserOption } from "../components/Dashboard/ChildUserOption";
import { Signup } from "../components/Forms/Signup";

function HomePage() {
  const { authUser } = useAuthStore();

  // Windows
  const [isSetting, setIsSetting] = useState(false);
  const [isRootSignup, setIsRootSignup] = useState(false);
  const [isRegisterCollege, setIsRegisterCollege] = useState(false);

  return (
    <>
      <section className="min-h-screen">
        {isSetting && <DashboardSetting setIsSetting={setIsSetting} />}

        {/* Signup Page for Root User */}
        {authUser.role === "root" && isRootSignup && (
          <div className="fixed w-full min-h-screen flex justify-center items-center bg-white/20 backdrop-blur-sm">
            <Signup
              role="root"
              componentType="Add Root User"
              setCloseForm={setIsRootSignup}
            />
          </div>
        )}

        {/* Registration for College (Principle Signup) */}
        {authUser.role === "root" && isRegisterCollege && (
          <div className="fixed w-full min-h-screen flex justify-center items-center bg-white/20 backdrop-blur-sm">
            <Signup
              role="root"
              componentType="Register College"
              setCloseForm={setIsRootSignup}
            />
          </div>
        )}

        <Navbar setIsSetting={setIsSetting} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info */}
          <UserInfoPanel />

          {/* Displays only if it is root user */}
          {/* Root user panel */}
          {authUser.role === "root" && (
            <ChildUserOption
              quiryType="root"
              userType="Root Users"
              setIsAddUser={setIsRootSignup}
            />
          )}
          {/* College Panel */}
          {authUser.role === "root" && (
            <ChildUserOption
              quiryType="college"
              userType="Colleges"
              setIsAddUser={setIsRegisterCollege}
            />
          )}
        </main>
      </section>
    </>
  );
}

export default HomePage;
