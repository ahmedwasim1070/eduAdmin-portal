// React
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Zustand
import { useAuthStore } from "../../store/useAuthStore";
// Axios
import { axiosInstance } from "../../lib/axios";
// Icons
import { X, Pencil } from "lucide-react";

// Props for this component
type DashboardSettingProps = {
  setIsSetting: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashboardSetting = ({ setIsSetting }: DashboardSettingProps) => {
  const { authUser, setAuthUser } = useAuthStore();

  // Loader
  const [isLoading, setIsLoading] = useState(false);
  // Shows Name Form
  const [changeNameForm, setChangeNameForm] = useState(false);
  // Changes the name
  const [newFullName, setNewFullName] = useState("");

  // Handles Name Change
  const handleNameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/user/change/name", {
        newFullName,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        setChangeNameForm(false);
        setAuthUser({ ...authUser, fullName: newFullName });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error in fetch API :", err);
      toast.error("An Unexpected error occoured !");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 min-h-screen backdrop-blur-sm bg-white/10 z-50">
        <div className="absolute top-1/2 left-1/2 2xl:w-1/2 lg:w-[70%] sm:w-[90%] 2xl:h-[70%] sm:h-[90%] -translate-x-1/2 -translate-y-1/2 bg-white border shadow-2xl border-black/20 rounded-xl">
          <button
            onClick={() => setIsSetting(false)}
            className="absolute right-2 top-2 cursor-pointer hover:bg-gray-300 rounded-full p-0.5 duration-75"
          >
            <X className="w-9 h-9 text-gray-600" />
          </button>
          {/*  */}
          <h2 className="font-medium text-3xl text-textColor text-center py-10">
            Settings
          </h2>
          {/*  */}
          <div className="max-w-3xl mx-auto py-5">
            {/*  */}
            <hr className="border border-gray-300 " />
            {/*  */}
            <div className="flex flex-row justify-around items-center ">
              {/*  */}
              {/* Gives change name form if user pressed the edit name  */}
              <div className="flex flex-col item-center justify-center px-4 py-5 text-center">
                {!changeNameForm ? (
                  <span className="flex flex-row gap-x-2 items-center">
                    <p className="text-textColor text-xl">
                      {authUser.fullName}
                    </p>
                    <button
                      onClick={() => setChangeNameForm(true)}
                      className="p-2 bg-secondaryColor rounded-lg border border-gray-500 group duration-100 hover:bg-transparent cursor-pointer"
                    >
                      <Pencil className="text-primaryColor w-5 h-5 group-hover:fill-secondaryColor" />
                    </button>
                  </span>
                ) : (
                  <form
                    onSubmit={handleNameChange}
                    className="flex flex-row gap-x-2 items-center justify-center"
                  >
                    <input
                      onChange={(e) => {
                        setNewFullName(e.target.value);
                      }}
                      name="changedName"
                      className="rounded-md border py-1 px-2 text-textColor outline-none"
                      type="text"
                      placeholder="Enter new name"
                    />
                    <button
                      onClick={() => setChangeNameForm(false)}
                      type="button"
                      className="p-1 border border-red-500 bg-red-500 rounded-lg cursor-pointer duration-100 hover:bg-transparent group"
                    >
                      <X className="text-secondaryColor group-hover:text-textColor" />
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-secondaryColor rounded-lg text-textColor border border-textColor cursor-pointer duration-100 hover:bg-transparent"
                    >
                      Change Name
                    </button>
                  </form>
                )}
                <p className="text-primaryColor pt-2 text-sm">
                  {authUser.email}
                </p>
              </div>
              {/*  */}
              <div className="rounded-full shadow-2xl">
                <svg
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-18"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill="#494c4e"
                      d="M9 0a9 9 0 0 0-9 9 8.654 8.654 0 0 0 .05.92 9 9 0 0 0 17.9 0A8.654 8.654 0 0 0 18 9a9 9 0 0 0-9-9zm5.42 13.42c-.01 0-.06.08-.07.08a6.975 6.975 0 0 1-10.7 0c-.01 0-.06-.08-.07-.08a.512.512 0 0 1-.09-.27.522.522 0 0 1 .34-.48c.74-.25 1.45-.49 1.65-.54a.16.16 0 0 1 .03-.13.49.49 0 0 1 .43-.36l1.27-.1a2.077 2.077 0 0 0-.19-.79v-.01a2.814 2.814 0 0 0-.45-.78 3.83 3.83 0 0 1-.79-2.38A3.38 3.38 0 0 1 8.88 4h.24a3.38 3.38 0 0 1 3.1 3.58 3.83 3.83 0 0 1-.79 2.38 2.814 2.814 0 0 0-.45.78v.01a2.077 2.077 0 0 0-.19.79l1.27.1a.49.49 0 0 1 .43.36.16.16 0 0 1 .03.13c.2.05.91.29 1.65.54a.49.49 0 0 1 .25.75z"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
            {/*  */}
            <hr className="border border-gray-300 " />
            {/*  */}
            <div className="max-w-2xl py-6 flex flex-row justify-around items-center ">
              <p className="text-textColor text-xl">Change Password</p>
              <Link
                to="/forgetpassword"
                className="p-3 bg-secondaryColor rounded-lg border border-primaryColor/70 cursor-pointer duration-100 hover:bg-transparent"
              >
                <Pencil className="text-primaryColor w-5 h-5 group-hover:fill-secondaryColor" />
              </Link>
            </div>
            <hr className="border border-gray-300 " />
            {/*  */}
          </div>
        </div>
      </div>
    </>
  );
};
