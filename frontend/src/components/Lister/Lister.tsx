// React
import { useState } from "react";

// Zustand
import { userFeatureStore } from "../../store/userFeatureStore";

// Component
import { ListerBar } from "./ListerBar";

// Buttons component
import { ActivateBtn, AddBtn, DeleteBtn, SuspendBtn } from "../Buttons/Button";

// Props for this component
type ListerProps = {
  componentType: string;
  quiriedUsers: any[];
  updateQuiry: React.Dispatch<React.SetStateAction<any>>;
  setIsRootSingup?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCollegeSignup?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Lister = ({
  componentType,
  quiriedUsers,
  updateQuiry,
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
            quiryLength={Object.keys(quiriedUsers).length}
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
            quiryLength={Object.keys(quiriedUsers).length}
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
            quiryLength={Object.keys(quiriedUsers).length}
            isListed={isListed}
            setIsListed={setIsListed}
          />
        )}

        {/* For suspended component tyoe */}
        {componentType === "suspended" && (
          <ListerBar
            heading="Suspended Users"
            quiryLength={Object.keys(quiriedUsers).length}
            isListed={isListed}
            setIsListed={setIsListed}
          />
        )}

        {/*  */}
        <div className="m-5 bg-gray-200 rounded-lg p-5 flex flex-col justify-center items-center border border-black/20">
          {Object.keys(quiriedUsers).length === 0 ? (
            <p className="text-textColor font-medium">No User Fetched ! </p>
          ) : (
            Object.keys(quiriedUsers).map((key, idx) => (
              <UserInfo
                componentType={componentType}
                key={idx}
                objectKey={key}
                quiriedUsers={quiriedUsers}
                updateQuiry={updateQuiry}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

const UserInfo = ({
  componentType,
  objectKey,
  quiriedUsers,
  updateQuiry,
}: {
  componentType: string;
  objectKey: string;
  quiriedUsers: any;
  updateQuiry: React.Dispatch<React.SetStateAction<any>>;
}) => {
  // Expandes the component
  const [isListed, setIsListed] = useState(false);

  // Zustand vairables
  const { isLoading } = userFeatureStore();

  return (
    <>
      <div
        className={`flex flex-col w-full bg-white my-2 rounded-xl shadow-sm duration-300 ${
          isListed ? "h-70 overflow-y-scroll" : "h-16 overflow-y-hidden"
        }`}
      >
        {/*  */}
        <ListerBar
          heading={isLoading ? "Processing ..." : objectKey}
          isListed={isListed}
          setIsListed={setIsListed}
          quiryLength={
            quiriedUsers[objectKey].length === 1
              ? 0
              : quiriedUsers[objectKey].length
          }
          PrimaryBtn={
            ["root", "college"].includes(componentType) ? (
              <SuspendBtn
                actionOn={objectKey}
                quiriedUsers={quiriedUsers}
                updateQuiry={updateQuiry}
              />
            ) : (
              ["suspended", "deleted"].includes(componentType) && (
                <ActivateBtn
                  actionOn={objectKey}
                  quiriedUsers={quiriedUsers}
                  updateQuiry={updateQuiry}
                />
              )
            )
          }
          SecondaryBtn={
            ["root", "college"].includes(componentType) && (
              <DeleteBtn
                actionOn={objectKey}
                quiriedUsers={quiriedUsers}
                updateQuiry={updateQuiry}
              />
            )
          }
        />
        {/*  */}
        {quiriedUsers[objectKey].map((user: any, idx: number) => (
          <div key={idx} className=" bg-gray-300 m-4 p-4 rounded-xl shadow-sm">
            {/*  */}
            <div className="flex flex-row justify-between items-center">
              {/* left */}
              <div>
                <h5 className="text-lg font-medium text-textColor">
                  {user.collegeName ? user.email + " :" : "Info :"}
                </h5>
              </div>
              {/* right */}
              <div className="flex flex-row gap-y-2">
                {/* For deleted and suspended users */}
                {user.collegeName &&
                  ["deleted", "suspended"].includes(componentType) && (
                    <>
                      {/* Primary Btn */}
                      <span>
                        <ActivateBtn
                          actionOn={objectKey}
                          quiriedUsers={quiriedUsers}
                          updateQuiry={updateQuiry}
                        />
                      </span>
                    </>
                  )}
                {/* For Active users */}
                {user.collegeName && ["college"].includes(componentType) && (
                  <>
                    {/* Primary Btn */}
                    <span>
                      <SuspendBtn
                        actionOn={objectKey}
                        quiriedUsers={quiriedUsers}
                        updateQuiry={updateQuiry}
                      />
                    </span>
                    {/* Secondary Btn */}
                    <span>
                      <DeleteBtn
                        actionOn={objectKey}
                        quiriedUsers={quiriedUsers}
                        updateQuiry={updateQuiry}
                      />
                    </span>
                  </>
                )}
              </div>
            </div>
            {/*  */}
            <div className="p-4 flex flex-col gap-y-2 m-2">
              {/* ID */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>ID :</p> <p>{user._id}</p>
              </div>
              {/* Full Name */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Full Name :</p> <p>{user.fullName}</p>
              </div>
              {/* Email */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Email :</p> <p>{user.email}</p>
              </div>
              {/* Contact Number */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Contact Number :</p> <p>{user.contactNumber}</p>
              </div>
              {/* Role */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Role :</p> <p>{user.role}</p>
              </div>
              {/* Created By */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Created By :</p> <p>{user.createdBy}</p>
              </div>
              {/* Last Login */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Last Login :</p>
                <p>{user.lastLogin ? user.lastLogin : "Never"}</p>
              </div>
              {/* Status */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Status :</p>
                <p>{user.status}</p>
              </div>
              {/* Email Status */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Email Status :</p>
                <p>{user.emailStatus}</p>
              </div>
              {/* Updated At  */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Updated At :</p>
                <p>{user.updatedAt}</p>
              </div>
              {/* Created At  */}
              <div className="flex flex-row gap-x-2 text-primaryColor font-medium">
                <p>Created At :</p>
                <p>{user.createdAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
