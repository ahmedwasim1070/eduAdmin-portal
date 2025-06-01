// Auth zustand
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const {  verifyToken } = useAuthStore();

  //
  const checkAuth = () => {
    try {
      verifyToken();
    } catch (error) {
      console.error("An unexpected error occoured !");
    }
  };
  //
  checkAuth();
  return (
    <>
      <div></div>
    </>
  );
}

export default HomePage;
