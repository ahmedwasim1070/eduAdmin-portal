import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.ts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const { login, checkAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [disableSubmit, setDisableSubmit] = useState(true);

  const [errorForm, setErrorForm] = useState({
    email: true,
    password: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === "email") {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
      if (!emailRegex.test(targetValue)) {
        setErrorForm({ ...errorForm, [targetName]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
      }
    }

    if (targetName === "password") {
      if (targetValue.length <= 8) {
        setErrorForm({ ...errorForm, [targetName]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
      }
    }
    setFormData({ ...formData, [targetName]: targetValue });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (disableSubmit != true) {
      const result = await login(formData);
      if (result.success) {
        toast.success(result.message);
        setFormData({
          email: "",
          password: "",
        });
        checkAuth();
        navigate("/");
      } else {
        toast.error(result.message);
        if (result.verifyEmail === true) {
          navigate("/verifyemail");
        }
      }
    }
  };

  useEffect(() => {
    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableSubmit(!allValid);
  }, [errorForm]);
  return (
    <>
      <div className="2xl:w-[25%] md:w-[40%]  border border-primaryColor rounded-lg bg-white shadow-2xl">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="px-4 py-4 text-center"
        >
          <h1 className="text-2xl text-textColor font-bold">Login</h1>
          <div className="flex flex-col gap-y-2 text-sm py-6 text-textColor">
            <div className="flex flex-col items-start gap-y-2">
              <label
                className={`${
                  errorForm.email ? "text-red-600" : "text-textColor"
                }`}
                htmlFor="Email"
              >
                {errorForm.email ? "Enter a valid Email" : "Email"}
              </label>
              <input
                value={formData.email}
                name="email"
                onChange={(e) => handleChange(e)}
                className={`w-full  bg-white rounded-md py-2 px-4 outline-none border ${
                  errorForm.email ? "border-red-600" : "border-secondaryColor"
                }`}
                type="email"
                placeholder="abc@example.com"
              />
            </div>
            <div className="flex flex-col items-start gap-y-2">
              <label
                className={`${
                  errorForm.password ? "text-red-600" : "text-textColor"
                }`}
                htmlFor="Password"
              >
                {errorForm.password ? "Enter a valid Password" : "Password"}
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
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
