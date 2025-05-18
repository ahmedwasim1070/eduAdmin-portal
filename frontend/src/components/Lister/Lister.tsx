import { useState } from "react";

// Component
import { ListerBar } from "./ListerBar";

// Buttons
import { AddBtn } from "../Buttons/Button";

type ListerProps = {
  componentType: string;
  quiriedUsers: any[];
  setIsRootSingup?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCollegeSignup?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Lister = ({
  componentType,
  quiriedUsers,
  setIsRootSingup,
  setIsCollegeSignup,
}: ListerProps) => {
  // Expands User Panle
  const [isListed, setIsListed] = useState(false);

  return (
    <>
      <div
        className={`shadow border border-gray-300 rounded-lg my-4 duration-300   flex flex-col ${
          isListed ? "h-100 overflow-y-scroll" : "h-18 overflow-y-hidden"
        }`}
      >
        {/* Dynamically Changes according to the componnet type  */}

        {/* For Root component type */}
        {componentType === "root" && (
          <ListerBar
            heading="Root Users"
            quiryLength={quiriedUsers.length}
            isListed={isListed}
            setIsListed={setIsListed}
            PrimaryBtn={
              <AddBtn heading="Root Users" setIsSignup={setIsRootSingup} />
            }
          />
        )}

        {/* For College component type */}
        {componentType === "college" && (
          <ListerBar
            heading="College Users"
            quiryLength={quiriedUsers.length}
            isListed={isListed}
            setIsListed={setIsListed}
            PrimaryBtn={
              <AddBtn
                heading="College Users"
                setIsSignup={setIsCollegeSignup}
              />
            }
          />
        )}

        {/* For deleted component tyoe */}
        {componentType === "deleted" && (
          <ListerBar
            heading="Deleted Users"
            quiryLength={quiriedUsers.length}
            isListed={isListed}
            setIsListed={setIsListed}
          />
        )}

        {/* For suspended component tyoe */}
        {componentType === "suspended" && (
          <ListerBar
            heading="Suspended Users"
            quiryLength={quiriedUsers.length}
            isListed={isListed}
            setIsListed={setIsListed}
          />
        )}

        {/*  */}
        <div className="m-5 bg-gray-200 rounded-lg p-5 flex flex-col justify-center items-center border border-black/20">
          {Object.keys(quiriedUsers).length === 0 ? (
            <p className="text-textColor font-medium">No User Fetched ! </p>
          ) : Object.keys(quiriedUsers).map((key)=>(
            <div></div>
          ))}
        </div>
      </div>
    </>
  );
};

const UserInfo = ({ user }: any) => {
  const [isListed, setIsListed] = useState(false);
  return (
    <>
      <div
        className={`w-full bg-white my-2 rounded-xl shadow-sm duration-300 border border-black/10 ${
          isListed ? "h-70 overflow-y-scroll" : "h-16 overflow-y-hidden"
        }`}
      >
        <ListerBar
          heading={user.email}
          isListed={isListed}
          setIsListed={setIsListed}
        />
        <div className="m-4 p-6 bg-gray-200 rounded-xl shadow-sm text-textColor flex flex-col gap-y-6">
          <h4 className="text-2xl font-bold">INFO :</h4>
          <div className="px-8 flex flex-col gap-y-2">
            {/* User ID */}
            <div className="flex flex-row gap-x-2 items-center text-xl">
              <h5 className="font-semibold">ID : </h5>
              <p className="">{user._id}</p>
            </div>
            {/* User Full Name */}
            <div className="flex flex-row gap-x-2 items-center text-xl">
              <h5 className="font-semibold">Name : </h5>
              <p className="">{user.fullName}</p>
            </div>
            {/* User Email */}
            <div className="flex flex-row gap-x-2 items-center text-xl">
              <h5 className="font-semibold">Email : </h5>
              <p className="">{user.email}</p>
            </div>
            {/* User */}
            <div className="flex flex-row gap-x-2 items-center text-xl">
              <h5 className="font-semibold">College Name : </h5>
              <p className="">{user.collegeName}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
