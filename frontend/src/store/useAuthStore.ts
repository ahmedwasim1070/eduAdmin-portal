import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface AuthState {
  authUser: any | null;
  isRoot: boolean;

  isCheckingAuth: boolean;
  isRegisteringRoot: boolean;
  isLoginIn: boolean;

  checkAuth: () => Promise<void>;
  checkRoot: () => Promise<void>;
  registerRoot: (formData: any) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
  login: (formData: any) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;

  logout: () => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
  resetUserCache: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isRoot: false,

  isCheckingAuth: true,
  isRegisteringRoot: false,
  isLoginIn: false,

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

  registerRoot: async (formData) => {
    set({ isRegisteringRoot: true });
    try {
      const res = await axiosInstance.post("auth/signup/root", formData, {
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
      console.error("Error in registerRoot fetch : ", error);
      return {
        success: false,
        message: "Connection error",
        status: 0,
      };
    } finally {
      set({ isRegisteringRoot: false });
    }
  },

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

      return {
        success: res.status === 200,
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
      set({ isLoginIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.get("auth/logout", {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

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
    }
  },

  resetUserCache: () => {
    set({ authUser: null });
  },
}));
