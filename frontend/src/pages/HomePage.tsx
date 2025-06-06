// Auth zustand
import { useAuthStore } from "../store/useAuthStore";

// Component Navbar
import Navbar from "../components/Navbar";

function HomePage() {
  // User data
  const { authUser } = useAuthStore();

  return (
    <>
      <div id="homePage">
        {/* Header */}
        <Navbar userRole={authUser.role} />

        {/* Main */}
      </div>
    </>
  );
}

export default HomePage;
