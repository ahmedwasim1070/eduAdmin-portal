// Button component !
import { ExpanderBtn } from "../Buttons/Button";

type ListerProps = {
  heading: string;
  quiryLength?: number;
  isListed: boolean;
  setIsListed: React.Dispatch<React.SetStateAction<boolean>>;
  PrimaryBtn?: React.ReactNode;
  SecondaryBtn?: React.ReactNode;
};

export const ListerBar = ({
  heading,
  quiryLength,
  isListed,
  setIsListed,
  PrimaryBtn,
  SecondaryBtn,
}: ListerProps) => {
  return (
    <>
      <div className="flex flex-row justify-between items-center py-4 px-6">
        <p className="text-textColor font-semibold text-lg">
          {heading} {quiryLength && quiryLength > 0 && "(" + quiryLength + ")"}
        </p>
        <div>
          {/* Expand List */}
          <ExpanderBtn isListed={isListed} setIsListed={setIsListed} />
          {/* Left */}
          {PrimaryBtn}
          {/* Right */}
          {SecondaryBtn}
        </div>
      </div>
    </>
  );
};
