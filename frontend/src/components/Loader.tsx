// Icons
import { LoaderCircle } from "lucide-react";

export const MainLoader = () => {
  return (
    <>
      <span className="bg-white/50 fixed inset-0 backdrop-blur-sm flex justify-center items-center">
        <LoaderCircle className="w-10 h-10 animate-spin text-textColor" />
      </span>
    </>
  );
};

export const BtnLoader = () => {
  return (
    <>
      <LoaderCircle className="w-6 h-6 animate-spin text-white" />
    </>
  );
};
