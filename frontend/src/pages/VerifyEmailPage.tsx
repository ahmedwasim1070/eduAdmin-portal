import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";

function VerifyEmailPage() {
  const { reqOTP, isReqOTP } = useAuthStore();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    reqType: location.pathname.slice(1, location.pathname.length),
  });

  const [otpBox, setOtpBox] = useState(false);
  const [disableReqOTP, setDisableReqOTP] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [countDown, setCountDown] = useState(0);

  const [errorForm, setErrorForm] = useState({
    email: true,
    otp: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === "email") {
      if (!otpBox) {
        setFormData({ ...formData, [targetName]: targetValue });
      }
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
      if (!emailRegex.test(targetValue) && !otpBox) {
        setErrorForm({ ...errorForm, [targetName]: true });
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
      }
    }

    if (targetName === "otp") {
      const numberRegex = /^\d+$/;
      if (
        otpBox &&
        (targetValue === "" || numberRegex.test(targetValue)) &&
        targetValue.length <= 6
      ) {
        setFormData({ ...formData, [targetName]: targetValue });
      }
      if (!numberRegex.test(targetValue) || formData.otp.length > 6) {
        setErrorForm({ ...errorForm, [targetName]: true });
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
      }
    }
  };

  const handleOTPReq = async () => {
    if (disableReqOTP != true) {
      const result = await reqOTP(formData);

      if (result.success) {
        setOtpBox(true);
        setDisableReqOTP(false);
        setCountDown(300);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (disableSubmit != true) {
    }
  };

  useEffect(() => {
    setDisableReqOTP(errorForm.email);

    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableSubmit(!allValid);

    const timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setDisableReqOTP(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [errorForm]);
  return (
    <>
      <section className="w-full h-[100vh] flex justify-center items-center bg-gray-50">
        <div className="2xl:w-[25%] md:w-[40%]  border border-primaryColor rounded-lg bg-white shadow-2xl">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="px-4 py-4 text-center"
          >
            <h1 className="text-2xl text-textColor font-bold">Verify Email</h1>
            <p className="text-lg pt-2 text-textColor">
              Enter your registered email address to verify
            </p>
            <div className="flex flex-col gap-y-2 text-sm py-6 text-textColor">
              <div className="flex flex-col items-start gap-y-2">
                <label
                  className={
                    errorForm.email ? "text-red-600" : "text-textColor"
                  }
                  htmlFor="Email"
                >
                  {errorForm.email
                    ? "Enter your email to verify"
                    : countDown >= 1
                    ? countDown
                    : "Email"}
                </label>
                <div className="w-full flex flex-row gap-x-4">
                  <input
                    value={formData.email}
                    name="email"
                    onChange={(e) => handleChange(e)}
                    className={`w-full bg-white rounded-md py-2 px-4 outline-none border ${
                      errorForm.email
                        ? "border-red-600"
                        : "border-secondaryColor"
                    }`}
                    type="email"
                    placeholder="abc@example.com"
                  />
                  <button
                    onClick={() => handleOTPReq()}
                    disabled={disableReqOTP}
                    className={` py-1 font-bold text-white border border-primaryColor rounded-lg px-6 duration-100 ${
                      !disableReqOTP
                        ? "cursor-pointer bg-textColor hover:bg-white hover:text-textColor "
                        : "cursor-default bg-red-300"
                    } `}
                  >
                    Request OTP
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
                  className={`w-  bg-white rounded-md py-2 px-4 outline-none border ${
                    errorForm.otp ? "border-red-600" : "border-secondaryColor"
                  }`}
                  type="text"
                  placeholder="OTP"
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-y-2">
              <button
                disabled={disableSubmit}
                className={` text-white w-full py-3 rounded-lg text-lg font-bold  duration-100  border border-primaryColor  ${
                  disableSubmit
                    ? "bg-red-300"
                    : "bg-textColor hover:bg-white hover:text-textColor cursor-pointer"
                }`}
              >
                Verify Email
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default VerifyEmailPage;
