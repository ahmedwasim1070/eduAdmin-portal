// React
import { useState } from "react";

// Component FormField
import { TextFormField } from "../components/FormField";

function BaseSignupPage() {
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

  // Sets Form Data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <div className="min-w-screen min-h-screen flex items-center justify-center text-white">
        <form className="min-w-40 bg-black p-2">
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
        </form>
      </div>
    </>
  );
}

export default BaseSignupPage;
