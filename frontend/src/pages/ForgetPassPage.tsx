import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Verification } from "../components/Forms/Verification";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";

function ForgetPassPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth, changePassword } = useAuthStore();

  const [forgetPassword, setForgetPassword] = useState(false);
  const [otpAsPass, setOtpAsPass] = useState("");

  const [formData, setFormData] = useState({
    reqType: location.pathname.slice(1, location.pathname.length),
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [disableSubmit, setDisableSubmit] = useState(true);

  const [errorForm, setErrorForm] = useState({
    password: true,
    confirmPassword: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      if (value.length <= 8) {
        setErrorForm({ ...errorForm, [name]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [name]: false });
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrorForm({ ...errorForm, [name]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [name]: false });
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!disableSubmit) {
      setFormData((prev) => ({ ...prev, otp: otpAsPass })); // update the form data
      const result = await changePassword({ ...formData, otp: otpAsPass }); // send updated data

      if (result.success) {
        toast.success(result.message);
        checkAuth();
        navigate("/");
        setFormData({
          reqType: location.pathname.slice(1, location.pathname.length),
          password: "",
          confirmPassword: "",
          otp: "",
        });
      } else {
        toast.error(result.message);
      }
    }
  };

  useEffect(() => {
    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableSubmit(!allValid);
  }, [errorForm]);
  return (
    <>
      <section className="w-full h-[100vh] flex justify-center items-center bg-gray-50">
        {forgetPassword ? (
          <div className="2xl:w-[25%] md:w-[40%] border border-black/20 rounded-lg bg-white shadow-2xl">
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="px-4 py-4 text-center"
            >
              <h1 className="text-2xl text-textColor font-medium">
                Setup new Password
              </h1>
              <div className="flex flex-col gap-y-2 text-sm py-6 text-textColor">
                <div className="flex flex-col items-start gap-y-2">
                  <label
                    className={`${
                      errorForm.password ? "text-red-600" : "text-textColor"
                    }`}
                    htmlFor="Password"
                  >
                    {errorForm.password
                      ? "Password should be atleast 8 characters"
                      : "Password"}
                  </label>
                  <input
                    value={formData.password}
                    name="password"
                    onChange={(e) => handleChange(e)}
                    className={`w-full  bg-white rounded-md py-2 px-4 outline-none border ${
                      errorForm.password
                        ? "border-red-600"
                        : "border-secondaryColor"
                    }`}
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <div className="flex flex-col items-start gap-y-2">
                  <label
                    className={`${
                      errorForm.confirmPassword
                        ? "text-red-600"
                        : "text-textColor"
                    }`}
                    htmlFor="Confirm Password"
                  >
                    {errorForm.confirmPassword
                      ? "Password does not match"
                      : "Confirm password"}
                  </label>
                  <input
                    value={formData.confirmPassword}
                    name="confirmPassword"
                    onChange={(e) => handleChange(e)}
                    className={`w-full  bg-white rounded-md py-2 px-4 outline-none border ${
                      errorForm.confirmPassword
                        ? "border-red-600"
                        : "border-secondaryColor"
                    }`}
                    type="password"
                    placeholder="Repeat Password"
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
                  Setup
                </button>
              </div>
            </form>
          </div>
        ) : (
          <Verification
            setForgetPassword={setForgetPassword}
            setOtpAsPass={setOtpAsPass}
          />
        )}
      </section>
    </>
  );
}

export default ForgetPassPage;
