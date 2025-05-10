import { useState } from "react";
// Icon
import { ChevronDown, ChevronUp, ShieldMinus, Trash2 } from "lucide-react";
// Component
import { SiblingUserInfo } from "./SiblingUserInfor";

type ChildUserInfoProps = {
  users: { [key: string]: any[] };
};

export const ChildUserInfo = ({ users }: ChildUserInfoProps) => {
  // Hides User List
  const [hideUser, setIsHideUser] = useState(true);

  const collegeName = Object.keys(users)[0];
  const collegeUsersLength = users[collegeName].length;
  return (
    <>
      <div className="bg-gray-50 m-4 border border-black/20 rounded-xl">
        {/*  */}
        <div
          onClick={() => setIsHideUser(!hideUser)}
          className="bg-white px-6 py-4 flex flex-row justify-between rounded-xl items-center cursor-pointer hover:bg-gray-50 duration-100"
        >
          <p className="font-medium text-lg text-textColor">
            {collegeName
              ? collegeName + " (" + collegeUsersLength + ")"
              : "Null"}
          </p>
          <div className="flex flex-row gap-x-5">
            <button className="p-2  rounded-full hover:bg-primaryColor/10 cursor-pointer">
              {hideUser ? (
                <ChevronDown
                  className="w-6 h-6 text-primaryColor"
                  aria-label="Open"
                />
              ) : (
                <ChevronUp
                  className="w-6 h-6 text-textColor"
                  aria-label="Close"
                />
              )}
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full hover:bg-primaryColor/10 cursor-pointer"
            >
              <ShieldMinus
                className="w-6 h-6 text-red-500"
                aria-label="Suspend"
              />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full hover:bg-primaryColor/10 cursor-pointer"
            >
              <Trash2 className="w-6 h-6 text-red-500" aria-label="Suspend" />
            </button>
          </div>
        </div>
        {/* Show only if Hide user false */}
        {!hideUser && (
          <div className="p-5 bg-white">
            <div>
              {users[collegeName].map((user, idx) => (
                <SiblingUserInfo key={idx} user={user} />
              ))}
            </div>
          </div>
        )}
        {/*  */}
      </div>
    </>
  );
};
