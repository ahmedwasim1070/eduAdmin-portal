import { create } from "zustand";
import axiosInstance from "../api/axios";

// Types for useAuthStore
type Store = {
  // Variables
  isLoading: boolean;
  authUser: any | null;

  // Functions
  verifyToken: () => void;
};

export const useAuthStore = create<Store>()((set) => ({
  // Variables
  // Loader
  isLoading: false,
  // User Data
  authUser: null,

  // Functions
  // Sets User
  verifyToken: async () => {
    set({ isLoading: true });
    try {
      // Response
      const res = await axiosInstance.get("auth/validate/authToken");
      if (res.status === 200) {
        set({ authUser: res.data.authUser });
      }
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isLoading: false });
    }
    //
  },
}));
