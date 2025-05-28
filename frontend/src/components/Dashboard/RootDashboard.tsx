// React
import { useEffect, useState } from "react";

// Zustand
import { userFeatureStore } from "../../store/userFeatureStore";

// Icons
import { RefreshCcw } from "lucide-react";

// Component
import { Signup } from "../Forms/Signup";
import { Lister } from "../Lister/Lister";
import { ScrollText } from "lucide-react";
import toast from "react-hot-toast";

export const RootDashboard = () => {
  // Imports zustand function
  const { quiriedUsers, setQuiriedUsers } = userFeatureStore();

  // Loading
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  // Windows
  const [isRootSignup, setIsRootSingup] = useState(false);
  const [isCollegeSingup, setIsCollegeSignup] = useState(false);

  // Possible Quiried Users Outputs
  const [rootUsers, setRootUsers] = useState<any>({});
  const [colleges, setColleges] = useState<any>({});
  const [deletedUsers, setDeletedUsers] = useState<any>({});
  const [suspendedUsers, setSuspendedUsers] = useState<any>({});

  // Fetches quiried users
  const handleListUser = async () => {
    setIsFetchingUsers(true);
    try {
      const res = await setQuiriedUsers();

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error in fetct :", error);
      toast.error("An unexpected error occoured ! ");
    } finally {
      setIsFetchingUsers(false);
    }
  };

  //
  useEffect(() => {
    if (quiriedUsers && quiriedUsers.length > 0) {
      quiriedUsers.forEach((user) => {
        if (user.status === "active") {
          // Handle root users
          if (user.role === "root") {
            setRootUsers((prev: any) => {
              // Check if this email already exists in the object
              if (!prev[user.email]) {
                return {
                  ...prev,
                  [user.email]: [user],
                };
              }
              return prev;
            });
          }

          // Handle college users
          if (["principal", "admin", "student"].includes(user.role)) {
            setColleges((prev: any) => {
              const collegeName = user.collegeName;
              // Check if this college already exists in the object
              if (!prev[collegeName]) {
                return {
                  ...prev,
                  [collegeName]: [user],
                };
              }

              // Check if user already exists in this college array
              const collegeUsers = prev[collegeName];
              const userExists = collegeUsers.some(
                (existingUser: any) => existingUser.email === user.email
              );

              if (!userExists) {
                return {
                  ...prev,
                  [collegeName]: [...collegeUsers, user],
                };
              }

              return prev;
            });
          }
        }

        // Handle deleted users
        if (user.status === "deleted") {
          setDeletedUsers((prev: any) => {
            const key = user.collegeName || user.email;

            if (!prev[key]) {
              return {
                ...prev,
                [key]: [user],
              };
            }

            // Check if user already exists in this array
            const existingUsers = prev[key];
            const userExists = existingUsers.some(
              (existingUser: any) => existingUser.email === user.email
            );

            if (!userExists) {
              return {
                ...prev,
                [key]: [...existingUsers, user],
              };
            }

            return prev;
          });
        }

        // Handle suspended users
        if (user.status === "suspended") {
          setSuspendedUsers((prev: any) => {
            const key = user.collegeName || user.email;

            if (!prev[key]) {
              return {
                ...prev,
                [key]: [user],
              };
            }

            // Check if user already exists in this array
            const existingUsers = prev[key];
            const userExists = existingUsers.some(
              (existingUser: any) => existingUser.email === user.email
            );

            if (!userExists) {
              return {
                ...prev,
                [key]: [...existingUsers, user],
              };
            }

            return prev;
          });
        }
      });
    }
  }, [quiriedUsers]);

  //
  return (
    <section>
      {/* Popups Singup page */}
      {(isRootSignup || isCollegeSingup) && (
        <div className="fixed min-w-screen min-h-screen overflow-x-scroll inset-0 bg-white/10 backdrop-blur-sm flex items-center">
          {isRootSignup && (
            <Signup
              role="root"
              heading="Add Root User"
              setCloseForm={setIsRootSingup}
            />
          )}
          {isCollegeSingup && (
            <Signup
              role="principal"
              heading="Add College"
              setCloseForm={setIsCollegeSignup}
            />
          )}
        </div>
      )}

      <div className="border border-black/20 rounded-xl shadow-xl p-4">
        <div className=" flex flex-row justify-between py-2">
          <p className="text-textColor font-bold text-2xl">Users</p>
          <button
            onClick={handleListUser}
            className={`${
              isFetchingUsers ? "bg-gray-400" : "bg-secondaryColor"
            } px-4 py-2 rounded-lg shadow inline-flex items-center gap-x-2 cursor-pointer duration-100 hover:bg-secondaryColor/40 mx-2`}
          >
            {isFetchingUsers ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" />
                <p className="text-gray-600 font-medium text-sm">Loading</p>
              </>
            ) : (
              <>
                <ScrollText className="w-4 h-4 text-textColor" />
                <p className="text-textColor font-medium text-sm">
                  Fetch Users
                </p>
              </>
            )}
          </button>
        </div>
        {/* Root User Lister */}
        <Lister
          componentType="root"
          quiriedUsers={rootUsers}
          updateQuiry={setRootUsers}
          setIsRootSingup={setIsRootSingup}
        />
        {/* Root User Lister */}
        <Lister
          componentType="college"
          quiriedUsers={colleges}
          updateQuiry={setColleges}
          setIsCollegeSignup={setIsCollegeSignup}
        />
        {/* Root User Lister */}
        <Lister
          componentType="deleted"
          quiriedUsers={deletedUsers}
          updateQuiry={setColleges}
        />
        {/* Root User Lister */}
        <Lister
          componentType="suspended"
          quiriedUsers={suspendedUsers}
          updateQuiry={setColleges}
        />
      </div>
    </section>
  );
};
