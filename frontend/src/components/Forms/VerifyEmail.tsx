// React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Axios custom API
import axiosInstance from "../../api/axios";
// Zustand
import { useAuthStore } from "../../store/useAuthStore";

// Component Loader
import { BtnLoader, MainLoader } from "../Loader";
// Component TextField Form
import { TextFormField } from "./FormField";

// Verify Email Props types
type VerifyEmailProps = {
  componenType: string;
  heading: string;
  setIsVerified?: React.Dispatch<React.SetStateAction<boolean>>;
};

function VerifyEmail({
  componenType,
  heading,
  setIsVerified,
}: VerifyEmailProps) {
  // Zustand functions
  const { verifyToken } = useAuthStore();
  // Navigator to redirect
  const navigate = useNavigate();

  //   Request otp cooldown
  const [otpCooldown, setOtpCooldown] = useState(0);
  // Loader for form
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  // Submit button
  const [isDisabledReqOtp, setIsDisabledReqOtp] = useState(true);
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);

  // Form Data
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  // Errors in  formData
  const [errorForm, setErrorForm] = useState({
    email: true,
    otp: true,
  });

  //   Handles value input on form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      // Validates email value
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
      if (emailRegex.test(value)) {
        setErrorForm({ ...errorForm, [name]: false });
      } else {
        setErrorForm({ ...errorForm, [name]: true });
      }
    }

    // Validates otp value
    if (name === "otp") {
      if (value.length === 6) {
        setErrorForm({ ...errorForm, [name]: false });
      } else {
        setErrorForm({ ...errorForm, [name]: true });
      }
    }

    // Sets formData according to the input
    setFormData({ ...formData, [name]: value });
  };

  //   Handles Request OTP
  const handleReqOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Disables Req OTP button
    setIsDisabledReqOtp(true);
    // Starts loader
    setIsRequesting(true);
    try {
      const res = await axiosInstance.post("auth/request/otp", formData);

      // On success
      if (res.status === 200) {
        // Sets timer
        setOtpCooldown(300);
        // dismiss previous notificaiton
        toast.dismiss();
        // sucess message
        toast.success(res.data.message);
      }
    } catch (error) {
    } finally {
      // Ends loader
      setIsRequesting(false);
    }
  };

  // Handle Submit verifies email
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevents default
    e.preventDefault();
    // Enables loader
    setIsVerifying(true);
    try {
      const res = await axiosInstance.post("auth/verify/otp", formData);

      // On success
      if (res.status === 200) {
        // dismiss previous notificaiton
        toast.dismiss();
        // sucess message
        toast.success(res.data.message);
        // Reset's forms
        setFormData({
          email: "",
          otp: "",
        });

        // Navigates to homepage if it is verify email page
        if (componenType === "verifyEmail") {
          navigate("/");
          verifyToken();
        }
        // Ask for new password if it is forgetPassword from
        if (componenType === "forgetPassword" && setIsVerified)
          setIsVerified(true);
      }
    } catch (error) {
    } finally {
      // Disables loader
      setIsVerifying(false);
    }
  };

  //   Enables the Request and verify button on valid input of formData
  useEffect(() => {
    if (!errorForm.email && otpCooldown === 0) {
      // Enables request otp button
      setIsDisabledReqOtp(false);
    } else {
      // Disables request otp button
      setIsDisabledReqOtp(true);
    }

    if (!errorForm.email && !errorForm.otp) {
      // Enables submit button
      setIsDisabledSubmit(false);
    } else {
      // Disables submit button
      setIsDisabledSubmit(true);
    }
  }, [errorForm, otpCooldown]);

  //   Sets Otp Cooldown timer
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => {
        setOtpCooldown(otpCooldown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  return (
    <>
      <div className="min-w-screen min-h-screen fixed flex flex-col items-center justify-center bg-white/30 backdrop:blur-sm">
        {/*  */}
        <div className="min-w-sm border border-black/30 shadow-2xl shadow-primaryColor/30 rounded-xl flex flex-col px-3">
          {/* Loader */}
          {isVerifying && <MainLoader />}

          {/* Heading */}
          <h1 className="text-center text-textColor font-bold text-2xl my-4">
            {heading}
          </h1>

          {/* Form Starts here */}
          <form onSubmit={handleSubmit}>
            {/* Email And Button */}
            <div className="w-full flex flex-row justify-center items-center gap-x-2">
              {/* Email Field */}
              <TextFormField
                label={errorForm.email ? "Enter a valid Email" : "Email"}
                id="email"
                type="email"
                placeholder="Enter Email ..."
                handleChange={handleChange}
              />
              {/*  */}

              {/* Button */}
              <button
                disabled={isDisabledReqOtp}
                onClick={handleReqOtp}
                type="button"
                className={`w-full border border-primaryColor mt-6 rounded-lg py-1.5 flex items-center justify-center text-white text-lg duration-100  ${
                  isDisabledReqOtp
                    ? "bg-red-200"
                    : "bg-primaryColor hover:text-primaryColor hover:bg-transparent cursor-pointer"
                }`}
              >
                {/* Content */}
                <p>
                  {isRequesting ? (
                    <BtnLoader />
                  ) : otpCooldown > 0 ? (
                    otpCooldown
                  ) : (
                    "Request OTP"
                  )}
                </p>
              </button>
              {/*  */}
            </div>
            {/*  */}

            {/* OTP Field */}
            <div className="w-1/2">
              <TextFormField
                label={errorForm.otp ? "Enter a valid OTP" : "OTP"}
                id="otp"
                type="text"
                placeholder="Enter 6 digit OTP ..."
                handleChange={handleChange}
              />
            </div>
            {/*  */}

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
              <p>{heading}</p>
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

export default VerifyEmail;
