import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "lucide-react";

/**
 * Types for the Signup component props
 */
type SignupProps = {
  role?: string; // Optional role for user registration
  componentType?: string; // Optional title for the component
  setIsRootSignup?: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle signup modal
};

/**
 * Form field structure
 */
type FormData = {
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  role?: string;
  status?: string;
};

/**
 * Form validation error state structure
 */
type ErrorForm = {
  fullName: boolean;
  email: boolean;
  contactNumber: boolean;
  password: boolean;
  confirmPassword: boolean;
};

/**
 * Signup Component - Handles user registration with validation
 */
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

  /**
   * Validation regex patterns
   */
  const validationPatterns = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    phone: /^\+?\d{10,14}$/,
  };

  /**
   * Validation error messages
   */
  const errorMessages = {
    fullName: "Name should be between 2 and 42 characters",
    email: "Enter a valid email",
    contactNumber: "Enter a valid phone number",
    password: "Password should be at least 8 characters",
    confirmPassword: "Passwords do not match",
  };

  /**
   * Handles form input changes and validates each field
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let isValid = false;

    // Validate based on field name
    switch (name) {
      case "fullName":
        isValid = value.length >= 2 && value.length <= 42;
        break;
      case "email":
        isValid = validationPatterns.email.test(value);
        break;
      case "contactNumber":
        isValid = validationPatterns.phone.test(value);
        break;
      case "password":
        isValid = value.length > 8;
        // Also update confirmPassword validation if it has a value
        if (formData.confirmPassword) {
          setErrorForm((prev) => ({
            ...prev,
            confirmPassword: value !== formData.confirmPassword,
          }));
        }
        break;
      case "confirmPassword":
        isValid = value === formData.password;
        break;
      default:
        break;
    }

    // Update error state for the field
    setErrorForm((prev) => ({ ...prev, [name]: !isValid }));

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Form submission handler
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!disableSubmit) {
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
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    });
  };

  /**
   * Check if all form fields are valid
   */
  useEffect(() => {
    const allValid = Object.values(errorForm).every((val) => val === false);
    setDisableSubmit(!allValid);
  }, [errorForm]);

  /**
   * Form input field component
   */
  const FormField = ({
    label,
    name,
    type,
    placeholder,
    value,
    hasError,
  }: {
    label: string;
    name: keyof FormData;
    type: string;
    placeholder: string;
    value: string;
    hasError: boolean;
  }) => (
    <div className="flex flex-col items-start gap-y-2 mb-4">
      <label
        className={`${
          hasError ? "text-red-600" : "text-textColor"
        } text-sm md:text-base`}
        htmlFor={name}
      >
        {hasError ? errorMessages[name as keyof ErrorForm] : label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full bg-white rounded-md py-2 px-4 outline-none border text-sm md:text-base
          ${hasError ? "border-red-600" : "border-secondaryColor"}`}
      />
    </div>
  );

  return (
    <div
      className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] 
                    border border-black/20 rounded-lg bg-white shadow-2xl relative mx-auto"
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
        className="px-4 py-6 md:px-6 lg:px-8 text-center"
      >
        {/* Form Title */}
        <h1 className="text-xl md:text-2xl text-textColor font-medium mb-4">
          {componentType || "Signup"}
        </h1>

        {/* Form Fields */}
        <div className="flex flex-col gap-y-1 text-textColor">
          <FormField
            label="Full name"
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            hasError={errorForm.fullName}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="abc@example.com"
            value={formData.email}
            hasError={errorForm.email}
          />

          <FormField
            label="Contact number"
            name="contactNumber"
            type="tel"
            placeholder="+00 000-00000000"
            value={formData.contactNumber}
            hasError={errorForm.contactNumber}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            hasError={errorForm.password}
          />

          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat Password"
            value={formData.confirmPassword}
            hasError={errorForm.confirmPassword}
          />
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
      </form>
    </div>
  );
};
