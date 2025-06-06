// Axios
import axiosInstance from "../api/axios";
// Zustand
import { create } from "zustand";

// Types for useAuthStore
type Store = {
  // Variables
  isLoading: boolean;
  authUser: any | null;

  // Functions
  verifyToken: () => Promise<void>;
  setAuthUser: (user: any | null) => void;
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
    // Enables loader
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("auth/validate/token");

      //
      if (res.status === 200) {
        // Sets user data
        set({ authUser: res.data.authUser });
      }
    } catch (error) {
      set({ authUser: false });
    } finally {
      // Disables loader
      set({ isLoading: false });
    }
  },

  // Updates auth User payload
  setAuthUser: (user) => {
    set({ authUser: user });
  },
}));
