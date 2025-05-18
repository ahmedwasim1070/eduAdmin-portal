import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface UserFeatureProps {
  quiriedUsers: any[] | null;
  setQuiriedUsers: () => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
}

export const userFeatureStore = create<UserFeatureProps>((set) => ({
  // Quiried Users from db
  quiriedUsers: null,

  // Sets Quiried Users
  setQuiriedUsers: async () => {
    try {
      const res = await axiosInstance.get("user/quiryAll");

      if (res.status === 200) {
        set({ quiriedUsers: res.data.quiriedUsers });
      } else {
        set({ quiriedUsers: null });
      }

      return {
        success: res.status === 200,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in setQuiriedUsers", error);
      set({ quiriedUsers: null });
      return {
        success: false,
        message: "Connection error !",
        status: 0,
      };
    }
  },
}));
