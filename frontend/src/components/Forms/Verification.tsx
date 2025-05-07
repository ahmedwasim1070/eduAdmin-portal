import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";

// Props typecasting
type VerificationProps = {
  setForgetPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  setOtpAsPass?: React.Dispatch<React.SetStateAction<string>>;
};

type FormData = {
  email: string;
  otp: string;
  reqType: string;
};

type ErrorForm = {
  email: boolean;
  otp: boolean;
};

export const Verification = ({
  setForgetPassword,
  setOtpAsPass,
}: VerificationProps) => {
  const { checkAuth, reqOtp, verifyOtp } = useAuthStore();

  // To get the url
  const location = useLocation();
  // For redirect
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    reqType: location.pathname.slice(1),
  });

  // Error form
  const [errorForm, setErrorForm] = useState<ErrorForm>({
    email: true,
    otp: true,
  });

  // Validation Regex Pattrens
  const validationPatterns = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    digit: /^\d*$/,
  };

  // Disables the Request button
  const [disableOtpBtn, setDisableOtpBtn] = useState(true);
  // Loading for the otp request
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  // Cooldown after the otp request
  const [countDown, setCountDown] = useState(0);
  // Disables the Submit button
  const [disableVerify, setDisableVerify] = useState(true);

  // Handles form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle email input
    if (name === "email") {
      setFormData({ ...formData, email: value });

      // Email validation
      const isInvalid = !validationPatterns.email.test(value);

      setErrorForm({ ...errorForm, email: isInvalid });
      setDisableOtpBtn(isInvalid);
    }

    // Handle OTP input
    if (name === "otp") {
      // Only allow digits and max 6 length
      if (validationPatterns.digit.test(value) && value.length <= 6) {
        setFormData({ ...formData, otp: value });

        // OTP validation
        const isValid = value.length === 6;
        setErrorForm({ ...errorForm, otp: !isValid });
      }
    }
  };

  // Handles Request OTP
  const handleOTPReq = async () => {
    if (!disableOtpBtn) {
      setIsRequestingOtp(true);
      const result = await reqOtp(formData);

      if (result.success) {
        // Disable Request Button
        setDisableOtpBtn(true);
        // Add's Cool down Seconds
        setCountDown(300);

        toast.success(result.message);
      } else {
        if (result.status === 429) {
          // Disable Request Button
          setDisableOtpBtn(true);
          // Add's Cool down Seconds
          setCountDown(300);
        }
        toast.error(result.message);
      }
      setIsRequestingOtp(false);
    }
  };

  // Handle OTP verification
  const verifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!disableVerify) {
      if (formData.reqType === "verifyemail" || "forgetpassword") {
        const result = await verifyOtp(formData);

        if (result.success) {
          toast.success(result.message);

          // Redirect to Home page in verify email
          if (formData.reqType === "verifyemail") {
            checkAuth();
            navigate("/");
          }

          // Open different page on forget password
          if (formData.reqType === "forgetpassword") {
            if (setForgetPassword && setOtpAsPass) {
              setForgetPassword(true);
              setOtpAsPass(formData.otp);
            }
          }

          // Resets form
          setFormData({
            email: "",
            otp: "",
            reqType: location.pathname.slice(1),
          });
          //
        } else {
          toast.error(result.message);
        }
      }
    }
  };

  // Open submit button if there is no errors in form field
  useEffect(() => {
    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableVerify(!allValid);
  }, [errorForm]);

  // Enables countdown after the otp request
  useEffect(() => {
    if (countDown <= 0) return;

    const timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setDisableOtpBtn(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countDown]);
  //
  return (
    <>
      <div className="2xl:w-[25%] md:w-[40%] border border-black/20 rounded-lg bg-white shadow-2xl">
        <form onSubmit={(e) => verifyOTP(e)} className="px-4 py-4 text-center">
          <h1 className="text-2xl text-textColor font-bold">
            {/* Dynamically changes according to the route */}
            {/* For Email Verification route */}
            {formData.reqType === "verifyemail" && "Verify Email"}
            {/* For password change route */}
            {formData.reqType === "forgetpassword" && "Forget Password"}
          </h1>
          <p className="pt-2 text-textColor">
            {/* Dynamically changes according to the route */}
            {/* For Email Verification route */}
            {formData.reqType === "verifyemail" &&
              "Enter your registered email address"}
            {/* For password change route */}
            {formData.reqType === "forgetpassword" &&
              "Verify OTP to setup new password"}
          </p>
          <div className="flex flex-col gap-y-2 text-sm py-6 text-textColor">
            {/* Email Form Field */}
            <div className="flex flex-col items-start gap-y-2">
              <label
                className={errorForm.email ? "text-red-600" : "text-textColor"}
                htmlFor="Email"
              >
                {errorForm.email ? "Enter your email to verify" : "Email"}
              </label>
              <div className="w-full flex flex-row gap-x-4">
                <input
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                  className={`w-full bg-white rounded-md py-2 px-4 outline-none border ${
                    errorForm.email ? "border-red-600" : "border-secondaryColor"
                  }`}
                  type="email"
                  placeholder="abc@example.com"
                />
                <button
                  onClick={handleOTPReq}
                  disabled={disableOtpBtn}
                  type="button"
                  className={`py-1 font-bold text-white border border-primaryColor rounded-lg px-6 duration-100 flex items-center justify-center gap-2 ${
                    disableOtpBtn
                      ? "cursor-default bg-red-300"
                      : "cursor-pointer bg-textColor hover:bg-white hover:text-textColor"
                  }`}
                >
                  {isRequestingOtp ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : countDown >= 1 ? (
                    countDown + " Cooldown "
                  ) : (
                    "Request OTP"
                  )}
                </button>
              </div>
            </div>
            {/*  */}
            {/* OTP Form Field */}
            <div className="flex flex-col items-start gap-y-2">
              <label
                className={`${
                  errorForm.otp ? "text-red-600" : "text-textColor"
                }`}
                htmlFor="otp"
              >
                {errorForm.otp ? "OTP should be 6 numbers" : "OTP"}
              </label>
              <input
                value={formData.otp}
                name="otp"
                onChange={handleChange}
                className={`bg-white rounded-md py-2 px-4 outline-none border ${
                  errorForm.otp ? "border-red-600" : "border-secondaryColor"
                }`}
                type="text"
                placeholder="OTP"
              />
            </div>
            {/*  */}
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <button
              disabled={disableVerify}
              type="submit"
              className={` text-white w-full py-3 rounded-lg text-lg font-bold  duration-100  border border-primaryColor  ${
                disableVerify
                  ? "bg-red-300"
                  : "bg-textColor hover:bg-white hover:text-textColor cursor-pointer"
              }`}
            >
              {formData.reqType === "verifyemail" && "Verify Email"}
              {formData.reqType === "forgetpassword" && "Submit"}
            </button>
          </div>
          {/*  */}
        </form>
      </div>
    </>
  );
};
