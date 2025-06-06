// axios
import axios from "axios";
// React-hot-toast
import { toast } from "react-hot-toast";

// Create an Axios Instance
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // error from the server
    if (error.response) {
      // Server response with status and data
      const { status, data } = error.response;

      switch (status) {
        // For 400 - Bad Request
        case 400:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error(data?.message || "Bad Request - Invalid data provided");
          console.error("Bad Request:", data?.message);
          break;

        // For 401 - Unauthorized
        case 401:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error(data.message || "Session expired. Please login again.");
          console.error("Unauthorized access");
          break;

        // For 403 - Forbidden
        case 403:
          // dismiss previous notificaiton
          // Redirect
          toast.dismiss();
          toast.error(
            data?.message || "Access denied - Insufficient permissions"
          );
          console.error("Forbidden access:", data?.message);

          // Redirects to the verify email page if server says
          if (
            data.redirectEmailVerification &&
            window.location.pathname !== "/verify/email"
          ) {
            window.location.href = "/verify/email";
            return Promise.reject(error);
          }
          break;

        // For 404 - Not Found
        case 404:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error(data?.message || "Resource not found");
          console.error("Not Found:", data?.message);
          break;

        // For 409 - Conflict
        case 409:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error(data?.message || "Conflict - Resource already exists");
          console.error("Conflict:", data?.message);
          break;

        // For 429 - Rate Limited
        case 429:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error(
            data?.message || "Too many requests - Please wait and try again"
          );
          console.error("Rate Limited:", data?.message);
          break;

        // For 500 - Internal Server Error
        case 500:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error("Internal server error - Please try again later");
          console.error("Server Error:", data?.message);
          break;

        // For 502 - Bad Gateway
        case 502:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error("Server temporarily unavailable");
          console.error("Bad Gateway");
          break;

        // For 503 - Service Unavailable
        case 503:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error("Service unavailable - Please try again later");
          console.error("Service Unavailable");
          break;

        // Default case for other status codes
        default:
          // dismiss previous notificaiton
          toast.dismiss();
          toast.error(data?.message || `Server error (${status})`);
          console.error(`HTTP ${status}:`, data?.message);
      }
    }
    // Error while connecting to the server
    else if (error.request) {
      // dismiss previous notificaiton
      toast.dismiss();
      toast.error("Network Error - please check your internet connection!");
      console.error("Network Error - please check your internet connection!");
    } else {
      // dismiss previous notificaiton
      toast.dismiss();
      toast.error("An unexpected error has occurred!");
      console.error("An unexpected error has occurred!");
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
