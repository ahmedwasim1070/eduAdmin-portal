// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Axios custom API
import axiosInstance from "../../api/axios";
// Zustand
import { useAuthStore } from "../../store/useAuthStore";

// Component Loader
import { MainLoader } from "../Loader";
// Component FormField
import { TextFormField } from "./FormField";

function Login() {
  // Zustand functions
  const { verifyToken } = useAuthStore();
  // Navigator to redirect
  const navigate = useNavigate();

  // Loader for form
  const [isLogin, setIsLoginIn] = useState(false);
  // Submit button
  const [isDisabled, setIsDisabled] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //   Handles value input on form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Disables submit button
    setIsDisabled(true);
    // Starts loader
    setIsLoginIn(true);
    try {
      const res = await axiosInstance.post("auth/login", formData);

      if (res.status === 200) {
        // Verify Cookie to get user data
        verifyToken();
        // Rests the form
        setFormData({
          email: "",
          password: "",
        });
        // dismiss previous notificaiton
        toast.dismiss();
        // sucess message
        toast.success(res.data.message);
        // navigates to home page
        navigate("/");
      }
    } catch (error) {
    } finally {
      // Enables button
      setIsDisabled(false);
      // Removes loader
      setIsLoginIn(false);
    }
  };
  return (
    <>
      <div className="min-w-screen min-h-screen fixed flex flex-col items-center justify-center bg-white/30 backdrop:blur-sm">
        {/*  */}
        <div className="min-w-sm border border-black/30 shadow-2xl shadow-primaryColor/30 rounded-xl flex flex-col px-3">
          {/* Loader */}
          {isLogin && <MainLoader />}

          {/* Heading */}
          <h1 className="text-center text-textColor font-bold text-2xl my-4">
            Login
          </h1>

          {/* Form Starts here */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <TextFormField
              label="Email"
              id="email"
              type="email"
              placeholder="Enter Email ..."
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

            {/* Button */}
            <button
              disabled={isDisabled}
              type="submit"
              className="w-full border border-primaryColor my-4 rounded-lg py-2 bg-primaryColor text-white text-lg duration-100 hover:bg-transparent hover:text-primaryColor cursor-pointer "
            >
              <p>Login</p>
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

export default Login;
