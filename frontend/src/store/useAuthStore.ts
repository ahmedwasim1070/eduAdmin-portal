import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface AuthState {
  authUser: any | null;
  verifyEmailPage: boolean;
  loginOTPpage: boolean;
  isRoot: boolean;

  isCheckingAuth: boolean;
  isRegisteringRoot: boolean;
  isLoginIn: boolean;
  isReqOTP: boolean;

  checkAuth: () => Promise<void>;
  checkRoot: () => Promise<void>;
  registerRoot: (formData: any) => Promise<{
    success: boolean;
    errorEmail: boolean;
    message: string;
    status: number;
  }>;
  login: (formData: any) => Promise<{
    success: boolean;
    loginOTP?: boolean;
    verifyEmail?: boolean;
    message: string;
    status: number;
  }>;
  logout: () => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
  reqOTP: (formData: any) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
  resetUserCache: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // use full variable
  authUser: null,
  verifyEmailPage: false,
  loginOTPpage: false,
  isRoot: false,

  // Loading variable
  isCheckingAuth: true,
  isRegisteringRoot: false,
  isLoginIn: false,
  isReqOTP: false,

  // Cookie validator
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/check", {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Root checker
  checkRoot: async () => {
    set({ isRegisteringRoot: true });
    try {
      const res = await axiosInstance.get("auth/checkRoot", {
        validateStatus: (status) => status < 500,
      });

      if (res.data.exsists) {
        set({ isRoot: res.data.exsists });
      } else {
        set({ isRoot: false });
      }
    } catch (error) {
      console.log("Error in checkRoot", error);
      set({ isRoot: false });
    } finally {
      set({ isRegisteringRoot: false });
    }
  },

  // Registers Root
  registerRoot: async (formData) => {
    set({ isRegisteringRoot: true });
    try {
      const res = await axiosInstance.post("auth/signup/root", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500,
      });

      if (res.data.isRoot && res.data.isRoot === true) {
        set({ isRoot: true });
      }
      return {
        success: res.status === 200,
        errorEmail: res.data.error,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in registerRoot fetch : ", error);
      return {
        success: false,
        errorEmail: false,
        message: "Connection error",
        status: 0,
      };
    } finally {
      set({ isRegisteringRoot: false });
    }
  },

  // Create auth cookie
  login: async (formData) => {
    set({ isLoginIn: true });
    try {
      const res = await axiosInstance.post("auth/login", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500,
      });

      // Opens verify email page
      if (res.data.verifyEmail && res.data.verifyEmail === true) {
        set({ verifyEmailPage: true });
      }

      // Open loginOTP page
      if (res.data.loginOTP && res.data.loginOTP === true) {
        set({ loginOTPpage: true });
      }

      return {
        success: res.status === 200,
        loginOTP: res.data.loginOTP,
        verifyEmail: res.data.verifyEmail,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in login fetch :", error);
      set({ verifyEmailPage: false, loginOTPpage: false });
      return {
        success: false,
        message: "Connection Error !",
        status: 0,
      };
    } finally {
      set({ isLoginIn: false });
    }
  },

  // Clear auth cookies (logout)
  logout: async () => {
    try {
      const res = await axiosInstance.get("auth/logout", {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

      return {
        success: res.status === 200,
        loginOTP: res.data.loginOTP,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in logout fetch : ", error);
      return {
        success: false,
        message: "Connection Error !",
        status: 0,
      };
    }
  },

  reqOTP: async (formData) => {
    set({ isReqOTP: true });
    try {
      const res = await axiosInstance.post("auth/reqOTP", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500,
      });

      return {
        success: res.status === 200,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in reqOTP fetch :", error);
      return {
        success: false,
        message: "Connection error",
        status: 0,
      };
    } finally {
      set({ isReqOTP: false });
    }
  },

  // clear user info
  resetUserCache: () => {
    set({ authUser: null });
  },
}));
