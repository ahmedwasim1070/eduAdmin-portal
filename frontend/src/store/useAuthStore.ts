import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface AuthState {
  authUser: any | null;
  setAuthUser: (user: any) => void;
  verifyEmailPage: boolean;
  isRoot: boolean;

  isLoading: boolean;

  // Asynchronize Functions
  checkAuth: () => Promise<void>;
  checkRoot: () => Promise<void>;
  registerRoot: (formData: any) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
  signup: (formData: any) => Promise<{
    success: boolean;
    errorEmail?: boolean;
    message: string;
    status: number;
  }>;
  login: (formData: any) => Promise<{
    success: boolean;
    verifyEmail?: boolean;
    message: string;
    status: number;
  }>;
  logout: () => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
  reqOtp: (formData: any) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
  verifyOtp: (formData: any) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
  changePassword: (formData: any) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // use full variable
  authUser: null,
  verifyEmailPage: false,
  isRoot: false,

  // Loading variable
  isLoading: true,

  setAuthUser: (user: any) => set({ authUser: user }),
  // Cookie validator
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/check");

      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isLoading: false });
    }
  },

  // Root checker
  checkRoot: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("auth/checkRoot");

      if (res.data.exsists) {
        set({ isRoot: res.data.exsists });
      } else {
        set({ isRoot: false });
      }
    } catch (error) {
      console.log("Error in checkRoot", error);
      set({ isRoot: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Registers Root
  registerRoot: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("auth/signup/root", formData);

      if (res.data.isRoot) {
        set({ isRoot: true });
      }
      return {
        success: res.status === 200,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in registerRoot fetch : ", error);
      return {
        success: false,
        message: "Connection error",
        status: 0,
      };
    } finally {
      set({ isLoading: false });
    }
  },

  // Registers User
  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("auth/signup/user", formData);

      return {
        success: res.status === 200,
        errorEmail: res.data.verifyEmail,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in login fetch :", error);
      return {
        success: false,
        message: "Connection Error !",
        status: 0,
      };
    } finally {
      set({ isLoading: false });
    }
  },

  // Create auth cookie
  login: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("auth/login", formData);

      if (res.data.verifyEmail) {
        set({ verifyEmailPage: res.data.verifyEmail });
      }

      return {
        success: res.status === 200,
        verifyEmail: res.data.verifyEmail,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in login fetch :", error);
      return {
        success: false,
        message: "Connection Error !",
        status: 0,
      };
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear auth cookies (logout)
  logout: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("auth/logout");

      if (res.status === 200) {
        set({ authUser: "" });
      }

      return {
        success: res.status === 200,
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
    } finally {
      set({ isLoading: false });
    }
  },

  reqOtp: async (formData) => {
    try {
      const res = await axiosInstance.post("auth/req/otp", formData);

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
    }
  },

  verifyOtp: async (formData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("auth/verify/otp", formData);

      return {
        success: res.status === 200,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in verifyOTP fetch :", error);
      return {
        success: false,
        message: "Connection error",
        status: 0,
      };
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (formData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/auth/change/password", formData);

      return {
        success: res.status === 200,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in changePassword fetch :", error);
      return {
        success: false,
        message: "Connection error",
        status: 0,
      };
    } finally {
      set({ isLoading: false });
    }
  },
}));
