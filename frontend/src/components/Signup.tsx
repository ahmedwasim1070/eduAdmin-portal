import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.ts";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Signup = () => {
  const navigate = useNavigate();
  const { registerRoot } = useAuthStore();

  const location = useLocation();
  let componentHeading: String;
  location.pathname === "/signup/root"
    ? (componentHeading = "Root Signup")
    : (componentHeading = "Signup");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [disableSubmit, setDisableSubmit] = useState(true);

  const [errorForm, setErrorForm] = useState({
    fullName: true,
    email: true,
    contactNumber: true,
    password: true,
    confirmPassword: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === "fullName") {
      if (targetValue.length < 2 || targetValue.length > 42) {
        setErrorForm({ ...errorForm, [targetName]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
      }
    }

    if (targetName === "email") {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
      if (!emailRegex.test(targetValue)) {
        setErrorForm({ ...errorForm, [targetName]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
      }
    }

    if (targetName === "contactNumber") {
      const phoneRegex = /^\+?\d{10,14}$/;
      if (!phoneRegex.test(targetValue)) {
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

    if (targetName === "confirmPassword") {
      if (targetValue !== formData.password) {
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
      if (location.pathname === "/signup/root") {
        const result = await registerRoot(formData);

        if (result.success) {
          toast.success(result.message);
          setFormData({
            fullName: "",
            email: "",
            contactNumber: "",
            password: "",
            confirmPassword: "",
          });
          navigate("/login");
        } else {
          toast.error(result.message);
        }
      }
    }
  };

  useEffect(() => {
    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableSubmit(!allValid);
  }, [errorForm]);

  return (
    <div className="2xl:w-[25%] md:w-[40%] border border-primaryColor rounded-lg bg-white shadow-2xl">
      <form onSubmit={(e) => handleSubmit(e)} className="px-4 py-4 text-center">
        <h1 className="text-2xl text-textColor font-medium">
          {componentHeading}
        </h1>
        <div className="flex flex-col gap-y-2 text-sm py-6 text-textColor">
          <div className="flex flex-col items-start gap-y-2">
            <label className="text-primaryColor" htmlFor="Name">
              {errorForm.fullName
                ? "Name should be atleast 2 to 42 characters"
                : "Full name"}
            </label>
            <input
              value={formData.fullName}
              name="fullName"
              onChange={(e) => handleChange(e)}
              className="w-full  bg-white rounded-md py-2 px-4 outline-none border border-secondaryColor"
              type="text"
              placeholder="Full Name"
            />
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <label className="text-primaryColor" htmlFor="Email">
              {errorForm.email ? "Enter a valid email" : "Email"}
            </label>
            <input
              value={formData.email}
              name="email"
              onChange={(e) => handleChange(e)}
              className="w-full  bg-white rounded-md py-2 px-4 outline-none border border-secondaryColor"
              type="email"
              placeholder="abc@example.com"
            />
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <label className="text-primaryColor" htmlFor="Contact Number">
              {errorForm.contactNumber
                ? "Enter a valid phone"
                : "Contact number"}
            </label>
            <input
              value={formData.contactNumber}
              name="contactNumber"
              onChange={(e) => handleChange(e)}
              className="w-full  bg-white rounded-md py-2 px-4 outline-none border border-secondaryColor"
              type="tel"
              placeholder="+00 000-00000000"
            />
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <label className="text-primaryColor" htmlFor="Password">
              {errorForm.password
                ? "Password should be atleast 8 characters"
                : "Password"}
            </label>
            <input
              value={formData.password}
              name="password"
              onChange={(e) => handleChange(e)}
              className="w-full  bg-white rounded-md py-2 px-4 outline-none border border-secondaryColor"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <label className="text-primaryColor" htmlFor="Confirm Password">
              {errorForm.confirmPassword
                ? "Password does not match"
                : "Confirm password"}
            </label>
            <input
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={(e) => handleChange(e)}
              className="w-full  bg-white rounded-md py-2 px-4 outline-none border border-secondaryColor"
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
            Signup
          </button>
        </div>
      </form>
    </div>
  );
};
