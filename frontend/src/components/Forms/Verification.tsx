import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";

type VerificationProps = {
  setForgetPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  setOtpAsPass?: React.Dispatch<React.SetStateAction<string>>;
};

export const Verification = ({
  setForgetPassword,
  setOtpAsPass,
}: VerificationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkAuth, reqOtp, verifyOtp } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    reqType: location.pathname.slice(1),
  });

  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [disableOtpInp, setDisableOtpInp] = useState(true);
  const [countDown, setCountDown] = useState(0);
  const [disableOtpBtn, setDisableOtpBtn] = useState(true);
  const [disableVerify, setDisableVerify] = useState(true);

  const [errorForm, setErrorForm] = useState({
    email: true,
    otp: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle email input
    if (name === "email" && disableOtpInp) {
      setFormData({ ...formData, email: value });

      // Email validation
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isInvalid = !emailRegex.test(value);

      setErrorForm({ ...errorForm, email: isInvalid });
      setDisableOtpBtn(isInvalid);
    }

    // Handle OTP input
    if (name === "otp" && !disableOtpInp && countDown >= 1) {
      const digitOnly = /^\d*$/;

      // Only allow digits and max 6 length
      if (digitOnly.test(value) && value.length <= 6) {
        setFormData({ ...formData, otp: value });

        // OTP validation
        const isValid = value.length === 6;
        setErrorForm({ ...errorForm, otp: !isValid });
      }
    }
  };

  const handleOTPReq = async () => {
    if (!disableOtpBtn) {
      setIsRequestingOtp(true);
      const result = await reqOtp(formData);

      if (result.success) {
        // Disable Request Button
        setDisableOtpBtn(true);
        // Enables OTP Input field
        setDisableOtpInp(false);
        // Add's Cool down Seconds
        setCountDown(300);

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setIsRequestingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!disableVerify) {
      if (formData.reqType === "verifyemail" || "forgetpassword") {
        const result = await verifyOtp(formData);

        if (result.success) {
          toast.success(result.message);

          if (formData.reqType === "verifyemail") {
            checkAuth();
            navigate("/");
          }

          if (formData.reqType === "forgetpassword") {
            if (setForgetPassword && setOtpAsPass) {
              setForgetPassword(true);
              setOtpAsPass(formData.otp);
              console.log("Done");
            }
          }

          setFormData({
            email: "",
            otp: "",
            reqType: location.pathname.slice(1, location.pathname.length),
          });
        } else {
          toast.error(result.message);
        }
      }
    }
  };

  useEffect(() => {
    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableVerify(!allValid);
  }, [errorForm]);

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
  return (
    <>
      <div className="2xl:w-[25%] md:w-[40%] border border-black/20 rounded-lg bg-white shadow-2xl">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="px-4 py-4 text-center"
        >
          <h1 className="text-2xl text-textColor font-bold">
            {formData.reqType === "verifyemail" && "Verify Email"}
            {formData.reqType === "forgetpassword" && "Forget Password"}
          </h1>
          <p className="pt-2 text-textColor">
            {formData.reqType === "verifyemail" &&
              "Enter your registered email address"}
            {formData.reqType === "forgetpassword" &&
              "Verify OTP to setup new password"}
          </p>
          <div className="flex flex-col gap-y-2 text-sm py-6 text-textColor">
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
                  onChange={(e) => handleChange(e)}
                  className={`w-full bg-white rounded-md py-2 px-4 outline-none border ${
                    errorForm.email ? "border-red-600" : "border-secondaryColor"
                  }`}
                  type="email"
                  placeholder="abc@example.com"
                />
                <button
                  onClick={handleOTPReq}
                  disabled={disableOtpBtn}
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
                onChange={(e) => handleChange(e)}
                className={`bg-white rounded-md py-2 px-4 outline-none border ${
                  errorForm.otp ? "border-red-600" : "border-secondaryColor"
                }`}
                type="text"
                placeholder="OTP"
              />
            </div>
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
        </form>
      </div>
    </>
  );
};
