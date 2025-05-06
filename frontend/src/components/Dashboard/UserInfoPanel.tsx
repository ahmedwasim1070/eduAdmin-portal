import { useAuthStore } from "../../store/useAuthStore";

export const UserInfoPanel = () => {
  const { authUser } = useAuthStore();

  return (
    <>
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-textColor text-lg font-medium mb-4">
          User Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-primaryColor">Full Name</p>
            <p className="font-medium">{authUser.fullName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-primaryColor">Email</p>
            <p className="font-medium">{authUser.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-primaryColor">Contact</p>
            <p className="font-medium">{authUser.contactNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-primaryColor">Status</p>
            <p className="font-medium">{authUser.status || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-primaryColor">Role</p>
            <p className="font-medium">{authUser.role || "N/A"}</p>
          </div>
        </div>
      </div>
    </>
  );
};
