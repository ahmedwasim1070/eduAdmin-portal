import { useState } from "react";

import { useAuthStore } from "../store/useAuthStore";

// Components
import { Navbar } from "../components/Dashboard/Navbar";
import { DashboardSetting } from "../components/Dashboard/DashboardSettings";
import { UserInfoPanel } from "../components/Dashboard/UserInfoPanel";
import { ChildUserInfo } from "../components/Dashboard/ChildUserInfo";
import { Signup } from "../components/Forms/Signup";

function HomePage() {
  const { authUser } = useAuthStore();

  // Windows
  const [isSetting, setIsSetting] = useState(false);
  const [isRootSignup, setIsRootSignup] = useState(false);

  // User Quiry
  const [rootUsers, setRootUsers] = useState([]);

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
              setIsRootSignup={setIsRootSignup}
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
            <ChildUserInfo
              userType={"Root Users"}
              setIsRootSignup={setIsRootSignup}
              setRootUsers={setRootUsers}
            />
          )}
          {/* College Panel */}
          {authUser.role === "root" && <ChildUserInfo userType={"Colleges"} />}

          <div>{JSON.stringify(rootUsers)}</div>
        </main>
      </section>
    </>
  );
}

export default HomePage;
