// Icons
import { Trash2, Pencil } from "lucide-react";

// Props typecast
type SiblinUserInfoProps = {
  user: any;
};

export const SiblingUserInfo = ({ user }: SiblinUserInfoProps) => (
  /*  */
  <div className="m-4 border border-black/20 rounded-lg p-4 shadow bg-gray-50">
    <div className="flex flex-row justify-between px-3 pb-4">
      {/* Left heading */}
      <p className="text-lg font-bold text-textColor">
        {user.role[0].toUpperCase() + user.role.slice(1)} :
      </p>

      {/* Left Buttons bar (delte and edit) */}
      <span className="p-2 rounded-full hover:bg-red-200 cursor-pointer">
        <Trash2 className="w-5 h-5 text-red-500" />
      </span>
    </div>
    <div className="py-4 px-10  flex flex-row justify-center gap-10 text-nowrap flex-wrap">
      {/* ID */}
      <div className="font-medium">
        <p className="text-textColor">User ID :</p>
        <p className="px-4">{user._id}</p>
      </div>
      {/* Name */}
      <div className="font-medium">
        <p className="text-textColor">User Name :</p>
        <p className="px-4">{user.fullName}</p>
      </div>
      {/* Email */}
      <div className="font-medium">
        <p className="text-textColor">User Email :</p>
        <p className="px-4">{user.email}</p>
      </div>
      {/* Contact Number */}
      <div className="font-medium">
        <p className="text-textColor">User Contact Number :</p>
        <p className="px-4">{user.contactNumber}</p>
      </div>
      {/* Email Status */}
      <div className="font-medium">
        <p className="text-textColor">User Email status :</p>
        <p className="px-4">{user.emailStatus}</p>
      </div>
      {/* Last Login ? */}
      <div className="font-medium">
        <p className="text-textColor">User Last Login :</p>
        <p className="px-4">
          {user.lastLogin ? user.lastLogin : "Never logged in"}
        </p>
      </div>
      {/* Role */}
      <div className="font-medium">
        <p className="text-textColor">User Role :</p>
        <p className="px-4">{user.role}</p>
      </div>
      {/* Created At */}
      <div className="font-medium">
        <p className="text-textColor">User Creation date :</p>
        <p className="px-4">{user.createdAt}</p>
      </div>
      {/* Created By */}
      <div className="font-medium">
        <p className="text-textColor">User Created by :</p>
        <p className="px-4">{user.createdBy ? user.createdBy : "Self"}</p>
      </div>
    </div>
  </div>
);
