// React
import { useState } from "react";
import toast from "react-hot-toast";

// Zustand
import { userFeatureStore } from "../../store/userFeatureStore";

// React Icons
import {
  Plus,
  ScrollText,
  ChevronDown,
  ChevronUp,
  Trash,
  RefreshCcw,
  Ban,
  Check,
} from "lucide-react";

// Add Buttons props
type AddBtnProps = {
  heading: string;
  setIsSignup?: React.Dispatch<React.SetStateAction<boolean>>;
};

// Expander Btn Props
type ExpanderBtnProps = {
  isListed: boolean;
  setIsListed: React.Dispatch<React.SetStateAction<boolean>>;
};

// Change Status Btn Props
type ChangeStatusBtnProps = {
  actionOn: string;
  quiriedUsers: any;
  updateQuiry: React.Dispatch<React.SetStateAction<any>>;
};

// Add User Button
export const AddBtn = ({ heading, setIsSignup }: AddBtnProps) => (
  <button
    onClick={() => setIsSignup && setIsSignup(true)}
    className="bg-blue-300 px-4 py-2 rounded-lg shadow inline-flex items-center gap-x-2 cursor-pointer duration-100 hover:bg-blue-100 mx-2"
  >
    <Plus className="w-4 h-4 text-black" />
    <p className="text-black font-medium text-sm">Add {heading}</p>
  </button>
);

// List User Button
export const ListBtn = () => {
  // Zustand Functions
  const { setQuiriedUsers } = userFeatureStore();
  return (
    <button
      onClick={setQuiriedUsers}
      className="bg-secondaryColor px-4 py-2 rounded-lg shadow inline-flex items-center gap-x-2 cursor-pointer duration-100 hover:bg-secondaryColor/40 mx-2"
    >
      <ScrollText className="w-4 h-4 text-textColor" />
      <p className="text-textColor font-medium text-sm">Fetch Users</p>
    </button>
  );
};

// Expander Button
export const ExpanderBtn = ({ isListed, setIsListed }: ExpanderBtnProps) => (
  <button
    onClick={() => setIsListed(!isListed)}
    className="p-2 hover:bg-primaryColor/20 rounded-full cursor-pointer mx-2"
  >
    {!isListed ? (
      <ChevronDown className="w-5 h-5 text-primaryColor" />
    ) : (
      <ChevronUp className="w-5 h-5 text-primaryColor" />
    )}
  </button>
);

// Hook for status changer btn calls changeStatus in zustand
const useHandleStatusBtns = () => {
  const { changeStatus, setQuiriedUsers } = userFeatureStore();

  return async (
    actionOn: string,
    statusType: string,
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
    quiriedUsers: any,
    updateQuiry: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setIsProcessing(true);
    try {
      const res = await changeStatus(actionOn, statusType);

      if (res.success) {
        setQuiriedUsers();
        updateQuiry(delete quiriedUsers[actionOn]);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("An unexpected error occured !", error);
      toast.error("An unexpected error occured !");
    } finally {
      setIsProcessing(false);
    }
  };
};

// Deletes User
export const DeleteBtn = ({
  actionOn,
  quiriedUsers,
  updateQuiry,
}: ChangeStatusBtnProps) => {
  // Loader
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle change status hook
  const handleStatusBtns = useHandleStatusBtns();

  return (
    <button
      onClick={() =>
        handleStatusBtns(
          actionOn,
          "deleted",
          setIsProcessing,
          quiriedUsers,
          updateQuiry
        )
      }
      className="duration-100 hover:bg-primaryColor/30 rounded-full cursor-pointer p-2"
    >
      {isProcessing ? (
        <RefreshCcw className="w-5 h-5 animate-spin" />
      ) : (
        <Trash className="w-5 h-5 text-primaryColor" />
      )}
    </button>
  );
};

// Suspends User
export const SuspendBtn = ({
  actionOn,
  quiriedUsers,
  updateQuiry,
}: ChangeStatusBtnProps) => {
  // Loader
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle change status hook
  const handleStatusBtns = useHandleStatusBtns();

  return (
    <button
      onClick={() =>
        handleStatusBtns(
          actionOn,
          "suspended",
          setIsProcessing,
          quiriedUsers,
          updateQuiry
        )
      }
      className="duration-100 hover:bg-primaryColor/30 rounded-full cursor-pointer p-2"
    >
      {isProcessing ? (
        <RefreshCcw className="w-5 h-5 animate-spin" />
      ) : (
        <Ban className="w-5 h-5 text-primaryColor" />
      )}
    </button>
  );
};

// Activate User
export const ActivateBtn = ({
  actionOn,
  quiriedUsers,
  updateQuiry,
}: ChangeStatusBtnProps) => {
  // Loader
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle change status hook
  const handleStatusBtns = useHandleStatusBtns();

  return (
    <button
      onClick={() =>
        handleStatusBtns(
          actionOn,
          "active",
          setIsProcessing,
          quiriedUsers,
          updateQuiry
        )
      }
      className="duration-100 hover:bg-secondaryColor/30 rounded-full cursor-pointer p-2"
    >
      {isProcessing ? (
        <RefreshCcw className="w-5 h-5 animate-spin" />
      ) : (
        <Check className="w-5 h-5 text-secondaryColor" />
      )}
    </button>
  );
};
