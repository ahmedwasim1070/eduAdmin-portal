// Auth zustand
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  //
  const { authUser } = useAuthStore();

  return (
    <>
      <div></div>
    </>
  );
}

export default HomePage;
