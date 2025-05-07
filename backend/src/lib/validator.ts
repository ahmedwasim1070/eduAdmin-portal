// Validator
type Role = "root" | "principal" | "admin" | "student";
type Status = "active" | "deleted" | "suspended";
type RequestedOtpType = "verifyemail" | "forgetpassword";

export class Validator {
  validateFullName(name: string): string | null {
    if (!name) return "Full name is required.";
    if (typeof name !== "string") return "Full name must be a string.";
    if (name.length < 3) return "Full name must be at least 3 characters.";
    if (name.length > 42) return "Full name must be less than 42 characters.";
    return null;
  }

  validateEmail(email: string): string | null {
    if (!email) return "Email is required.";
    if (typeof email !== "string") return "Email must be a string.";
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
    if (!emailRegex.test(email)) return "Invalid email address.";
    return null;
  }

  validatePhone(contactNumber: string): string | null {
    if (!contactNumber) return "Contact number is required.";
    if (typeof contactNumber !== "string")
      return "Contact number must be a string.";
    const phoneRegex = /^\+?\d{10,14}$/;
    if (!phoneRegex.test(contactNumber)) return "Invalid contact number.";
    return null;
  }

  validatePassword(password: string): string | null {
    if (!password) return "Password is required.";
    if (typeof password !== "string") return "Password must be a string.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return null;
  }

  validateConfirmPassword(
    password: string,
    confirmPassword: string
  ): string | null {
    if (!password) return "Password is required.";
    if (!confirmPassword) return "Confirm Password is required.";
    if (typeof password !== "string") return "Password must be a string.";
    if (typeof confirmPassword !== "string")
      return "Confirm Password must be a string.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (confirmPassword.length < 8)
      return "Confirm Password must be at least 8 characters.";
    if (confirmPassword !== password)
      return "password and confirm password does not match !";
    return null;
  }

  validateOTP(otp: string): string | null {
    if (!otp) return "OTP is required";
    if (typeof otp !== "string") return "OTP must be a stirng";
    if (otp.length > 6) return "Invalid OTP !";
    const digitRegex = /^\d*$/;
    if (!digitRegex.test(otp)) return "OTP should be a string";
    return null;
  }

  validateRole(role: string): string | null {
    const validRoles: Role[] = ["root", "principal", "admin", "student"];
    if (!role) return "Role is required.";
    if (!validRoles.includes(role as Role))
      return `Invalid role. Valid roles are: ${validRoles.join(", ")}`;
    return null;
  }

  validateStatus(status: string): string | null {
    const validStatuses: Status[] = ["active", "deleted", "suspended"];
    if (!status) return "Status is required.";
    if (!validStatuses.includes(status as Status))
      return `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`;
    return null;
  }

  validateRequestedOtpType(requestedOtpType: string): string | null {
    const validateRequestedOtpTypes: RequestedOtpType[] = [
      "verifyemail",
      "forgetpassword",
    ];
    if (!requestedOtpType) return " Request type is required";
    if (
      !validateRequestedOtpTypes.includes(requestedOtpType as RequestedOtpType)
    )
      return "Invalid request type";
    return null;
  }
}
