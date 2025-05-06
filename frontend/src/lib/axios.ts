import axios, { AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5001/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  validateStatus: (status) => status < 500,
});
