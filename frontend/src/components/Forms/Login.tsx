import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

type ErrorForm = {
  email: boolean;
  password: boolean;
};

export const Login = () => {
  const navigate = useNavigate();
  const { login, checkAuth } = useAuthStore();

  // Form state initialization
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  // Validation error state - all fields have errors by default
  const [errorForm, setErrorForm] = useState<ErrorForm>({
    email: true,
    password: true,
  });

  /** * Validation regex patterns */ 
  const validationPatterns = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  };

  /**
   * Validation error messages
   */
  const errorMessages = {
    email: "Enter a valid email",
    password: "Password should be at least 8 characters",
  };

  // Submit button state - disabled by default until validation passes
  const [disableSubmit, setDisableSubmit] = useState(true);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let isValid = true;

    switch (name) {
      case "email":
        isValid = !validationPatterns.email.test(value);
        break;
      case "password":
        isValid = value.length < 8;
        break;
      default:
        break;
    }

    setErrorForm({ ...errorForm, [name]: isValid });
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    //
  };

  // Enables Submit button if there is no error in errorForm
  useEffect(() => {
    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableSubmit(!allValid);
  }, [errorForm]);

  //
  return (
    <>
      <div className="2xl:w-[25%] md:w-[40%] border border-black/20 rounded-lg bg-white shadow-2xl">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="px-4 py-4 text-center"
        >
          <h1 className="text-3xl text-textColor font-bold">Login</h1>
          <div className="flex flex-col justify-start  items-start font-medium text-left text-sm py-5 text-textColor">
            {/* Email Form Field */}
            <div className="w-full flex flex-col gap-y-2 py-2">
              <label
                className={`${
                  errorForm.email ? "text-red-600" : "text-textColor"
                }`}
                htmlFor="email"
              >
                {errorForm.email ? errorMessages.email : "Email"}
              </label>
              <input
                className={`w-full bg-white rounded-md py-2 px-4 outline-none border ${
                  errorForm.email ? "border-red-600" : "border-secondaryColor"
                }`}
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
              />
            </div>
            {/* Password Form Field */}
            <div className="w-full flex flex-col gap-y-2 py-2">
              <label
                className={`${
                  errorForm.password ? "text-red-600" : "text-textColor"
                }`}
                htmlFor="password"
              >
                {errorForm.password ? errorMessages.password : "Password"}
              </label>
              <input
                className={`w-full bg-white rounded-md py-2 px-4 outline-none border ${
                  errorForm.password
                    ? "border-red-600"
                    : "border-secondaryColor"
                }`}
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
              />
            </div>
            {/* Forget Password */}
            <div className="py-1">
              <Link
                className="underline hover:text-secondaryColor"
                to="/forgetpassword"
              >
                Forget Password ?
              </Link>
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
          {/*  */}
        </form>
      </div>
    </>
  );
};
