import { ScrollText, Plus } from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

type ChildUserInfoProps = {
  userType: string;
  setIsRootSignup?: React.Dispatch<React.SetStateAction<boolean>>;
  setRootUsers?: React.Dispatch<React.SetStateAction<any>>;
};

export const ChildUserInfo = ({
  userType,
  setIsRootSignup,
  setRootUsers,
}: ChildUserInfoProps) => {
  // handle root quiry request
  const handleRootQuiry = async (): Promise<void> => {
    if (setRootUsers) {
      const res = await axiosInstance.get("quiry/users/root");

      if (res.status === 200) {
        setRootUsers(res.data.rootUsers);
        toast.success(res.data.message);
      } else {
        setRootUsers([]);
        toast.error(res.data.message);
      }
    }
  };

  return (
    <>
      <div className="mb-8 bg-white rounded-lg shadow p-6 flex justify-between items-center">
        <h2 className="text-textColor text-lg font-medium">{userType}</h2>
        <div className="flex justify-center items-center gap-x-4">
          <button
            onClick={() => setIsRootSignup && setIsRootSignup(true)}
            className="flex items-center gap-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer"
          >
            <Plus className="w-4 h-4 " />
            Add {userType.slice(0, -1)}
          </button>
          <button
            onClick={() => handleRootQuiry()}
            className="flex items-center gap-x-2 px-3 py-1 bg-secondaryColor text-textColor rounded-md hover:bg-secondaryColor/60 cursor-pointer"
          >
            <ScrollText className="w-4 h-4" />
            List {userType}
          </button>
        </div>
      </div>
    </>
  );
};
