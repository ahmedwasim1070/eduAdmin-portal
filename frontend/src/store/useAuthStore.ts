import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface AuthState {
  authUser: any | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/check");

      set({ authUser: res.data.user.user });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    }
  },
}));
