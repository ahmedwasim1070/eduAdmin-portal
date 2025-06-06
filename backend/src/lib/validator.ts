// For Type script
type Role = "root" | "principal" | "admin" | "student";
type Status = "active" | "deleted" | "suspended";

// Validates Full Name
export const validateFullName = (userFullName: string): string | null => {
  if (!userFullName) return "Full name is required.";
  if (typeof userFullName !== "string") return "Full name must be a string.";
  if (userFullName.length < 3)
    return "Full name must be at least 3 characters.";
  if (userFullName.length > 42)
    return "Full name must be less than 42 characters.";
  return null;
};

// Validates Email
export const validateEmail = (userEmail: string): string | null => {
  if (!userEmail) return "Email is required.";
  if (typeof userEmail !== "string") return "Email must be a string.";
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
  if (!emailRegex.test(userEmail)) return "Invalid email address.";
  return null;
};

// Validate Contact Number
export const validateContactNUmber = (
  userContactNumber: string
): string | null => {
  if (!userContactNumber) return "Contact number is required.";
  if (typeof userContactNumber !== "string")
    return "Contact number must be a string.";
  const phoneRegex = /^\+?\d{10,14}$/;
  if (!phoneRegex.test(userContactNumber)) return "Invalid contact number.";
  return null;
};

// Validates Password
export const validatePassword = (userPassword: string): string | null => {
  if (!userPassword) return "Password is required.";
  if (typeof userPassword !== "string") return "Password must be a string.";
  if (userPassword.length < 8) return "Password must be at least 8 characters.";
  return null;
};

// Validates Confirm Password
export const validateConfirmPassword = (
  userPassword: string,
  confirmUserPassword: string
): string | null => {
  if (!userPassword) return "Password is required.";
  if (!confirmUserPassword) return "Confirm Password is required.";
  if (typeof userPassword !== "string") return "Password must be a string.";
  if (typeof confirmUserPassword !== "string")
    return "Confirm Password must be a string.";
  if (userPassword.length < 8) return "Password must be at least 8 characters.";
  if (confirmUserPassword.length < 8)
    return "Confirm Password must be at least 8 characters.";
  if (confirmUserPassword !== userPassword)
    return "password and confirm password does not match !";
  return null;
};

// Validates OTP
export const validateOTP = (userOtp: string): string | null => {
  if (!userOtp) return "OTP is required";
  if (typeof userOtp !== "string") return "OTP must be a stirng";
  if (userOtp.length === 5) return "Invalid OTP !";
  const digitRegex = /^\d*$/;
  if (!digitRegex.test(userOtp)) return "OTP should be a string";
  return null;
};

// Validates Role
export const validateRole = (userRole: string): string | null => {
  const validRoles: Role[] = ["root", "principal", "admin", "student"];
  if (!userRole) return "Role is required.";
  if (!validRoles.includes(userRole as Role))
    return `Invalid role. Valid roles are: ${validRoles.join(", ")}`;
  return null;
};

// Validates Status
export const validateStatus = (userStatus: string): string | null => {
  const validStatuses: Status[] = ["active", "deleted", "suspended"];
  if (!userStatus) return "Status is required.";
  if (!validStatuses.includes(userStatus as Status))
    return `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`;
  return null;
};

// Validates College Name
export const validateCollegeName = (userCollegeName: string): string | null => {
  if (!userCollegeName) return "College name is required.";
  if (typeof userCollegeName !== "string")
    return "College name must be a string.";
  if (userCollegeName.length < 3)
    return "College Name must be at least 3 characters.";
  if (userCollegeName.length > 62)
    return "College name must be less than 62 characters.";
  return null;
};

// Validate User Location
export const validateUserLocation = (userLocation: string): string | null => {
  if (!userLocation) return "User location is required.";
  if (typeof userLocation !== "string")
    return "College location must be a string.";
  if (userLocation.length < 3)
    return "User location must be at least 3 characters.";
  if (userLocation.length > 62)
    return "User location must be less than 62 characters.";
  return null;
};
