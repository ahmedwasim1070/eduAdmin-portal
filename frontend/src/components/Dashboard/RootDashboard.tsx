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

// Buttons

export const RootDashboard = () => {
  const { quiriedUsers, setQuiriedUsers } = userFeatureStore();
  // Loading
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  // Windows
  const [isRootSignup, setIsRootSingup] = useState(false);
  const [isCollegeSingup, setIsCollegeSignup] = useState(false);

  // Possible Quiried Users Outputs
  const [rootUsers, setRootUsers] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<any[]>([]);
  const [suspendedUsers, setSuspendedUsers] = useState<any[]>([]);

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
        // Check helper
        const isDuplicate = (arr: any[], user: any) =>
          arr.some((u) => u._id === user._id || u.email === user.email);

        // If deleted push in deleted
        if (user.status === "deleted") {
          setDeletedUsers((prev) =>
            isDuplicate(prev, user) ? prev : [...prev, user]
          );
        }

        // If suspended push in suspended
        if (user.status === "suspended") {
          setSuspendedUsers((prev) =>
            isDuplicate(prev, user) ? prev : [...prev, user]
          );
        }

        // If a root user push in root
        if (user.role === "root" && user.status === "active") {
          setRootUsers((prev) =>
            isDuplicate(prev, user) ? prev : [...prev, user]
          );
        }

        // If a college user push in that college
        if (
          ["principal", "admin", "student"].includes(user.role) &&
          user.collegeName &&
          user.status === "active"
        ) {
          setColleges((prev) => {
            let collegeExists = false;

            const updatedColleges = prev.map((college) => {
              const collegeName = Object.keys(college)[0];

              if (collegeName === user.collegeName) {
                collegeExists = true;

                // Check for duplicate before adding
                const alreadyInCollege = college[collegeName].some(
                  (u: any) => u._id === user._id || u.email === user.email
                );

                if (alreadyInCollege) return college;

                const updatedCollege = [...college[collegeName], user];
                return {
                  [collegeName]: updatedCollege,
                };
              }

              return college;
            });

            if (!collegeExists) {
              updatedColleges.push({
                [user.collegeName]: [user],
              });
            }

            return updatedColleges;
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
        <div className="fixed w-full max-h-screen overflow-x-scroll inset-0 bg-white/10 backdrop-blur-sm">
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
          setIsRootSingup={setIsRootSingup}
        />
        {/* Root User Lister */}
        <Lister
          componentType="college"
          quiriedUsers={colleges}
          setIsCollegeSignup={setIsCollegeSignup}
        />
        {/* Root User Lister */}
        <Lister componentType="deleted" quiriedUsers={deletedUsers} />
        {/* Root User Lister */}
        <Lister componentType="suspended" quiriedUsers={suspendedUsers} />
      </div>
    </section>
  );
};
