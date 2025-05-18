import { userFeatureStore } from "../../store/userFeatureStore";
import { Plus, ScrollText, ChevronDown, ChevronUp } from "lucide-react";

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
  const { setQuiriedUsers } = userFeatureStore();
  const handleListUser = () => {
    setQuiriedUsers();
  };
  return (
    <button
      onClick={handleListUser}
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
