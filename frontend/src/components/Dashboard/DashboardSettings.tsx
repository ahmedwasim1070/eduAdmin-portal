import { useAuthStore } from "../../store/useAuthStore";
import { X, Pencil } from "lucide-react";

type DashboardSettingProps = {
  setIsSetting: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashboardSetting = ({ setIsSetting }: DashboardSettingProps) => {
  const { authUser } = useAuthStore();

  return (
    <>
      <div className="fixed inset-0 min-h-screen backdrop-blur-sm bg-white/10 z-50">
        <div className="absolute top-1/2 left-1/2 2xl:w-1/2 lg:w-[70%] sm:w-[90%] 2xl:h-[65%] sm:h-[90%] -translate-x-1/2 -translate-y-1/2 bg-white border shadow-2xl border-black/20 rounded-xl flex flex-col items-center justify-around py-4 gap-y-10">
          <button
            onClick={() => setIsSetting(false)}
            className="absolute right-2 top-2 cursor-pointer hover:bg-gray-300 rounded-full p-0.5 duration-75"
          >
            <X className="w-9 h-9 text-gray-600" />
          </button>
          <div>
            <h1 className="font-medium text-3xl text-textColor">Settings</h1>
          </div>
          <div className="2xl:w-[80%] sm:w-[95%] xl:py-8 sm:py-2 flex flex-col text-center">
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
    </>
  );
};
