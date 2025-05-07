import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "lucide-react";

// Types for the Signup component props
type SignupProps = {
  role?: string; // Optional role for user registration
  componentType?: string; // Optional title for the component
  setIsRootSignup?: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle signup modal
};

// Form field structure
type FormData = {
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  role?: string;
  status?: string;
};

// Form validation error state structure
type ErrorForm = {
  fullName: boolean;
  email: boolean;
  contactNumber: boolean;
  password: boolean;
  confirmPassword: boolean;
};

// Signup Component - Handles user registration with validation
export const Signup = ({
  role,
  componentType,
  setIsRootSignup,
}: SignupProps) => {
  const navigate = useNavigate();
  const { authUser, registerRoot, signup } = useAuthStore();

  // Form state initialization
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Submit button state - disabled by default until validation passes
  const [disableSubmit, setDisableSubmit] = useState(true);

  // Validation error state - all fields have errors by default
  const [errorForm, setErrorForm] = useState<ErrorForm>({
    fullName: true,
    email: true,
    contactNumber: true,
    password: true,
    confirmPassword: true,
  });

  // Validation regex patterns
  const validationPatterns = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    phone: /^\+?\d{10,14}$/,
  };

  // Validation error messages
  const errorMessages = {
    fullName: "Name should be between 2 and 42 characters",
    email: "Enter a valid email",
    contactNumber: "Enter a valid phone number",
    password: "Password should be at least 8 characters",
    confirmPassword: "Passwords do not match",
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let isValid = false;

    switch (name) {
      case "fullName":
        isValid = value.length < 3 || value.length > 42;
        break;
      case "email":
        isValid = !validationPatterns.email.test(value);
        break;
      case "contactNumber":
        isValid = !validationPatterns.phone.test(value);
        break;
      case "password":
        isValid = value.length < 8;
        break;
      case "confirmPassword":
        isValid = value !== formData.password;
        break;
      default:
        break;
    }

    setErrorForm({ ...errorForm, [name]: isValid });
    setFormData({ ...formData, [name]: value });
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let result;

      // Case 1: Creating a user when logged in as admin/root
      if (authUser && role) {
        const userData = {
          ...formData,
          role,
          status: "active",
        };

        result = await signup(userData);

        if (result.success) {
          toast.success(result.message);
          resetForm();
          setIsRootSignup && setIsRootSignup(false);
        } else {
          if (result.errorEmail) {
            setErrorForm((prev) => ({ ...prev, email: true }));
          }
          toast.error(result.message);
        }
      }
      // Case 2: Root user registration
      else if (location.pathname === "/signup/root") {
        result = await registerRoot(formData);

        if (result.success) {
          toast.success(result.message);
          resetForm();
          navigate("/login");
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  };

  // Check if all form fields are valid
  useEffect(() => {
    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableSubmit(!allValid);
  }, [errorForm]);

  return (
    <div
      className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] 
                    border border-black/20 rounded-xl bg-white shadow-2xl relative mx-auto"
    >
      {/* Close button - only shown when in modal mode */}
      {setIsRootSignup && (
        <button
          onClick={() => setIsRootSignup(false)}
          className="absolute right-2 top-2 cursor-pointer hover:bg-gray-300 rounded-full p-0.5 duration-75"
          aria-label="Close signup form"
        >
          <X className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
        </button>
      )}

      <form
        onSubmit={handleSubmit}
        className=" py-6 md:px-6 sm:px-6 text-center"
      >
        {/* Form Title */}
        <h1 className="text-3xl text-textColor font-bold mb-4">
          {componentType || "Signup"}
        </h1>

        {/* Form Fields */}
        <div className="flex flex-col justify-start items-start font-medium text-left text-sm py-2 text-textColor">
          {/* FullName Form Field */}
          <div className="w-full flex flex-col gap-y-2 py-2">
            <label
              className={`${
                errorForm.fullName ? "text-red-600" : "text-textColor"
              }`}
              htmlFor="fullName"
            >
              {errorForm.fullName ? errorMessages.fullName : "Full Name"}
            </label>
            <input
              className={`w-full bg-white rounded-md py-2 px-4 outline-none border ${
                errorForm.fullName ? "border-red-600" : "border-secondaryColor"
              }`}
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter you Full Name"
              onChange={handleChange}
            />
          </div>
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
              placeholder="Enter your Email"
              onChange={handleChange}
            />
          </div>
          {/* ContactNumber Form Field */}
          <div className="w-full flex flex-col gap-y-2 py-2">
            <label
              className={`${
                errorForm.contactNumber ? "text-red-600" : "text-textColor"
              }`}
              htmlFor="contactNumber"
            >
              {errorForm.contactNumber
                ? errorMessages.contactNumber
                : "Phone number"}
            </label>
            <input
              className={`w-full bg-white rounded-md py-2 px-4 outline-none border ${
                errorForm.contactNumber
                  ? "border-red-600"
                  : "border-secondaryColor"
              }`}
              type="text"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter your Phone number"
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
                errorForm.password ? "border-red-600" : "border-secondaryColor"
              }`}
              type="password"
              name="password"
              id="password"
              placeholder="Enter a strong password"
              onChange={handleChange}
            />
          </div>
          {/* Confirm password Form Field */}
          <div className="w-full flex flex-col gap-y-2 py-2">
            <label
              className={`${
                errorForm.confirmPassword ? "text-red-600" : "text-textColor"
              }`}
              htmlFor="confirmPassword"
            >
              {errorForm.confirmPassword
                ? errorMessages.confirmPassword
                : "Confirm Password"}
            </label>
            <input
              className={`w-full bg-white rounded-md py-2 px-4 outline-none border ${
                errorForm.confirmPassword
                  ? "border-red-600"
                  : "border-secondaryColor"
              }`}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Repeat password"
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={disableSubmit}
            className={`text-white w-full py-2 md:py-3 rounded-lg text-base md:text-lg font-bold
              transition-colors duration-200 border border-primaryColor
              ${
                disableSubmit
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-textColor hover:bg-white hover:text-textColor cursor-pointer"
              }`}
          >
            Signup
          </button>
        </div>
        {/*  */}
      </form>
    </div>
  );
};
