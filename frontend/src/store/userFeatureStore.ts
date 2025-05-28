import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface UserFeatureProps {
  // Loaders
  isLoading: boolean;

  // Object of data of child users
  quiriedUsers: any[] | null;

  // Sets quiried users
  setQuiriedUsers: () => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;

  // Deletes permanent
  deletePermanent: (quiriedUsers: any) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;

  // Changes status
  changeStatus: (
    actionOn: string,
    statusType: string
  ) => Promise<{
    success: boolean;
    message: string;
    status: number;
  }>;
}

export const userFeatureStore = create<UserFeatureProps>((set) => ({
  // Loader
  isLoading: false,

  // Quiried Users from db
  quiriedUsers: null,

  // Sets Quiried Users
  setQuiriedUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("user/quiryAll");

      if (res.status === 200) {
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
    } finally {
      set({ isLoading: false });
    }
  },

  // Deletes permanent
  deletePermanent: async (quiriedUsers) => {
    try {
      const res = await axiosInstance.post("user/delete/users", {
        quiriedUsers,
      });

      return {
        success: res.status === 200,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in deletePermanent", error);
      return {
        success: false,
        message: "Connection error !",
        status: 0,
      };
    }
  },

  // Changes status
  changeStatus: async (actionOn, statusType) => {
    try {
      const res = await axiosInstance.post("user/change/status", {
        actionOn,
        statusType,
      });

      return {
        success: res.status === 200,
        message: res.data.message,
        status: res.status,
      };
    } catch (error) {
      console.error("Error in setQuiriedUsers", error);
      return {
        success: false,
        message: "Connection error !",
        status: 0,
      };
    }
  },
}));
