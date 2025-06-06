// React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Axios custom API
import axiosInstance from "../../api/axios";
// Zustand
import { useAuthStore } from "../../store/useAuthStore";

// Component TextField Form
import { TextFormField } from "./FormField";
// Component Loader
import { MainLoader } from "../Loader";

function ForgetPass() {
  // Zustand functions
  const { verifyToken } = useAuthStore();
  // Navigator to redirect
  const navigate = useNavigate();

  // Loader for form
  const [isLoading, setIsLoading] = useState(false);
  // Submit button
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);

  // Form Data
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  //   Handles value input on form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Sets formData according to the input
    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit changes password
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevents default
    e.preventDefault();
    // Enables loader
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("auth/change/password", formData);

      //   On success
      if (res.status === 200) {
        // dismiss previous notificaiton
        toast.dismiss();
        // sucess message
        toast.success(res.data.message);
        // Reset's forms
        setFormData({
          newPassword: "",
          confirmNewPassword: "",
        });
        // resets auth User
        verifyToken();
        // Navigates to homePage
        navigate("/");
      }
    } catch (error) {
    } finally {
      // Disables loader
      setIsLoading(false);
    }
  };

  //   Enables the Passowrd change button according to the validity of the form
  useEffect(() => {
    if (
      formData.newPassword.length >= 8 &&
      formData.confirmNewPassword.length >= 8
    ) {
      setIsDisabledSubmit(false);
    }
  }, [formData]);

  return (
    <>
      <div className="min-w-screen min-h-screen fixed flex flex-col items-center justify-center bg-white/30 backdrop:blur-sm">
        {/*  */}
        <div className="min-w-sm border border-black/30 shadow-2xl shadow-primaryColor/30 rounded-xl flex flex-col px-3">
          {/* Loader */}
          {isLoading && <MainLoader />}

          {/* Heading */}
          <h1 className="text-center text-textColor font-bold text-2xl my-4">
            Setup new password
          </h1>

          {/* Form Starts here */}
          <form onSubmit={handleSubmit}>
            {/* Password Field */}
            <TextFormField
              label="New Password"
              id="newPassword"
              type="password"
              placeholder="Enter new password ..."
              handleChange={handleChange}
            />

            {/* Confirm Password Field */}
            <TextFormField
              label="Confirm New Password"
              id="confirmNewPassword"
              type="password"
              placeholder="Repeat your new password ..."
              handleChange={handleChange}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={isDisabledSubmit}
              className={`w-full border border-primaryColor my-4 rounded-lg py-2 bg-primaryColor text-white text-lg duration-100  ${
                isDisabledSubmit
                  ? "bg-red-200"
                  : "bg-primaryColor cursor-pointer hover:bg-transparent hover:text-primaryColor "
              }`}
            >
              <p>Set up new password</p>
            </button>
            {/*  */}
          </form>
          {/*  */}
        </div>
        {/*  */}
      </div>
    </>
  );
}

export default ForgetPass;
