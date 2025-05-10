// Icons
import { Trash2, Pencil } from "lucide-react";

// Props typecast
type ChildUserInfoProps = {
  key: number;
  content: any;
};

export const ChildUserInfo = ({ key, content }: ChildUserInfoProps) => (
  <div
    key={key}
    className="m-4 border border-black/20 rounded-lg p-4 shadow bg-gray-50"
  >
    <div className="flex flex-row justify-between px-3 pb-4">
      {/* Left heading */}
      <p className="text-lg font-bold text-textColor">
        {content.role[0].toUpperCase() + content.role.slice(1)} :
      </p>

      {/* Left Buttons bar (delte and edit) */}
      <div className="flex flex-row gap-x-4">
        <span className="p-2 rounded-full hover:bg-secondaryColor/20 cursor-pointer">
          <Pencil className="w-5 h-5 text-secondaryColor" />
        </span>
        <span className="p-2 rounded-full hover:bg-red-200 cursor-pointer">
          <Trash2 className="w-5 h-5 text-red-500" />
        </span>
      </div>
    </div>
    <div className="py-4 px-10  flex flex-row justify-center gap-10 text-nowrap flex-wrap">
      {/* ID */}
      <div className="font-medium">
        <p className="text-textColor">User ID :</p>
        <p className="px-4">{content._id}</p>
      </div>
      {/* Name */}
      <div className="font-medium">
        <p className="text-textColor">User Name :</p>
        <p className="px-4">{content.fullName}</p>
      </div>
      {/* Email */}
      <div className="font-medium">
        <p className="text-textColor">User Email :</p>
        <p className="px-4">{content.email}</p>
      </div>
      {/* Contact Number */}
      <div className="font-medium">
        <p className="text-textColor">User Contact Number :</p>
        <p className="px-4">{content.contactNumber}</p>
      </div>
      {/* Email Status */}
      <div className="font-medium">
        <p className="text-textColor">User Email status :</p>
        <p className="px-4">{content.emailStatus}</p>
      </div>
      {/* Last Login ? */}
      <div className="font-medium">
        <p className="text-textColor">User Last Login :</p>
        <p className="px-4">
          {content.lastLogin ? content.lastLogin : "Never logged in"}
        </p>
      </div>
      {/* Role */}
      <div className="font-medium">
        <p className="text-textColor">User Role :</p>
        <p className="px-4">{content.role}</p>
      </div>
      {/* Created At */}
      <div className="font-medium">
        <p className="text-textColor">User Creation date :</p>
        <p className="px-4">{content.createdAt}</p>
      </div>
      {/* Created By */}
      <div className="font-medium">
        <p className="text-textColor">User Created by :</p>
        <p className="px-4">{content.createdBy ? content.createdBy : "Self"}</p>
      </div>
    </div>
  </div>
);
