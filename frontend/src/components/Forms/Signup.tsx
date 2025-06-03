// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Axios custom API
import axiosInstance from "../../api/axios";

// Component Loader
import { MainLoader } from "../Loader";
// Component FormField
import { TextFormField } from "./FormField";

type SignupProps = {
  componentType: string;
  heading: string;
};

function Signup({ componentType, heading }: SignupProps) {
  // Navigator to redirect
  const navigate = useNavigate();

  // Loader for form
  const [isSigninUp, setIsSigninUp] = useState(false);
  // Submit button
  const [isDisabled, setIsDisabled] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    collegeName: "",
    userLocation: "",
  });

  //   Handles value input on form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Sets Value to formData
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Disables submit button
    setIsDisabled(true);
    // Starts loader
    setIsSigninUp(true);
    try {
      const res = await axiosInstance.post("auth/signup/root/base", formData);

      if (res.status === 200) {
        // Rests the form
        setFormData({
          fullName: "",
          email: "",
          contactNumber: "",
          password: "",
          confirmPassword: "",
          collegeName: "",
          userLocation: "",
        });
        // dismiss previous notificaiton
        toast.dismiss();
        // sucess message
        toast.success(res.data.message);
        // navigates to login page
        navigate("/login");
      }
    } catch (error) {
    } finally {
      // Enables button
      setIsDisabled(false);
      // Removes loader
      setIsSigninUp(false);
    }
  };

  return (
    <>
      <div className="min-w-screen min-h-screen fixed flex flex-col items-center justify-center bg-white/30 backdrop:blur-sm">
        {/*  */}
        <div className="min-w-sm border border-black/30 shadow-2xl shadow-primaryColor/30 rounded-xl flex flex-col px-3 ">
          {/* Loader */}
          {isSigninUp && <MainLoader />}

          {/* Heading */}
          <h1 className="text-center text-textColor font-bold text-2xl my-4">
            {heading}
          </h1>

          {/* Form Starts here */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <TextFormField
              label="Full Name"
              id="fullName"
              type="text"
              placeholder="Enter Full Name ..."
              handleChange={handleChange}
            />

            {/* Email */}
            <TextFormField
              label="Email"
              id="email"
              type="email"
              placeholder="Enter Email ..."
              handleChange={handleChange}
            />

            {/* Contact Number */}
            <TextFormField
              label="Contact Number"
              id="contactNumber"
              type="text"
              placeholder="Enter Contact Number ..."
              handleChange={handleChange}
            />

            {/* Password */}
            <TextFormField
              label="Password"
              id="password"
              type="password"
              placeholder="Enter Password ..."
              handleChange={handleChange}
            />

            {/* Confirm Password */}
            <TextFormField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password ..."
              handleChange={handleChange}
            />

            {/* Button */}
            <button
              disabled={isDisabled}
              type="submit"
              className="w-full border border-primaryColor my-4 rounded-lg py-2 bg-primaryColor text-white text-lg duration-100 hover:bg-transparent hover:text-primaryColor cursor-pointer "
            >
              <p>Signup</p>
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

export default Signup;
