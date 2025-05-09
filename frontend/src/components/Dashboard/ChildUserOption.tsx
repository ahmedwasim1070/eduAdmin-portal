import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

// Zustand
import { useAuthStore } from "../../store/useAuthStore";

// Icons
import { ScrollText, Plus, RefreshCcw } from "lucide-react";

// Components
import { SiblingUserInfo } from "./SiblingUserInfor";
import { ChildUserInfo } from "./ChildUserInfo";

// Props Casting
type ChildUserOptionProps = {
  quiryType: string;
  userType: string;
  setIsAddUser: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChildUserOption = ({
  quiryType,
  userType,
  setIsAddUser,
}: ChildUserOptionProps) => {
  const { authUser } = useAuthStore();
  // Loading
  const [isUpdating, steIsUpdating] = useState(false);
  // Changes button behavior
  const [isListed, setIsListed] = useState(false);
  // User Quiry data
  const [userQuiry, setUserQuiry] = useState([]);
  // Quiry Data Amount
  const [quiriedUser, setQuiriedUser] = useState(0);

  // handle user quiry request
  const handleQuiryRequest = async (): Promise<void> => {
    steIsUpdating(true);
    // Response
    const res = await axiosInstance.post("quiry/users", {
      requestType: quiryType,
    });

    if (res.status === 200) {
      setUserQuiry(res.data.user);
      // To expand Viewer
      setIsListed(true);
      // To show amount of user
      setQuiriedUser(res.data.user.length);

      // Sends update message if its not a first request
      if (isListed) {
        toast.success("Updated");
      } else {
        // Sends sucess message if not first request
        toast.success(res.data.message);
      }
    } else {
      setUserQuiry([]);
      setIsListed(false);
      setQuiriedUser(0);
      toast.error(res.data.message);
    }
    steIsUpdating(false);
  };

  //
  return (
    <>
      <div className="mb-4">
        <div className=" rounded-t-lg shadow p-6 flex flex-row justify-between items-center border border-black/30">
          <div>
            <h2 className="font-medium text-textColor text-lg">
              {" "}
              {userType} {quiriedUser > 0 && "(" + quiriedUser + ")"}
            </h2>
          </div>
          {/*  */}
          <div className="flex flex-row gap-x-4">
            {/* Left button */}
            <button
              onClick={() => setIsAddUser(true)}
              className="flex items-center gap-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer"
            >
              <Plus className="w-4 h-4 " />
              Add {userType.slice(0, -1)}
            </button>

            {/* Right button */}
            <button
              onClick={handleQuiryRequest}
              className={`flex items-center gap-x-2 px-3 py-1 rounded-md  cursor-pointer ${
                !isListed
                  ? " bg-secondaryColor text-textColor  hover:bg-secondaryColor/60"
                  : "bg-gray-300 hover:bg-gray-200"
              }`}
            >
              {isListed ? (
                <RefreshCcw className="w-4 h-4 text-gray-800" />
              ) : (
                <ScrollText className="w-4 h-4" />
              )}
              {isListed ? "Update " : "List " + userType}
            </button>
          </div>
        </div>

        {/* Loader and expand only if there is uerquiry */}
        <div
          className={`${userQuiry.length > 0 ? "h-100" : "h-0"} ${
            isUpdating ? "blur-sm" : "blur-none"
          } relative  rounded-b-lg shadow-md border border-black/20 bg-gray overflow-y-scroll overflow-x-hidden duration-300`}
        >
          {/* If User role and requested Root matches */}
          {authUser.role === quiryType &&
            userQuiry.map((user, idx) => (
              <SiblingUserInfo key={idx} user={user} />
            ))}

          {/* Only display if it is for college */}
          {quiryType === "college" &&
            userQuiry.map((users, idx) => (
              <ChildUserInfo key={idx} users={users} />
            ))}
          {/* Loader */}
          {isUpdating && (
            <div
              role="status"
              className="w-full h-full absolute inset-0 flex justify-center items-center"
            >
              <svg
                aria-hidden="true"
                className="w-12 h-12 text-gray-200 animate-spin dark:text-secondaryColor fill-textColor"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {/*  */}
        </div>
      </div>
    </>
  );
};
