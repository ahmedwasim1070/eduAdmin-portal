import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { AxiosResponse } from "axios";

interface AuthState {
  authUser: any | null;
  isRoot: boolean;
  isCheckingAuth: boolean;
  isRegisteringRoot: boolean;

  checkAuth: () => Promise<void>;
  checkRoot: () => Promise<void>;
  registerRoot: (formData: any, setFormData: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isRoot: false,

  isCheckingAuth: true,
  isRegisteringRoot: false,

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

  registerRoot: async (formData: any, setFormData: any) => {
    try {
      set({ isRegisteringRoot: true });
      const res = await axiosInstance.post("auth/signup/root", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500,
      });

      if (res.status === 200) {
        setFormData({
          fullName: "",
          email: "",
          contactNumber: "",
          password: "",
          confirmPassword: "",
        });
      }
      console.log(res.data.message);
    } catch (error) {
      console.error("Error in registerRoot fetch : ", error);
    } finally {
      set({ isRegisteringRoot: false });
    }
  },
}));
