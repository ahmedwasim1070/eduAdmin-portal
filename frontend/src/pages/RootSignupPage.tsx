import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.ts";
import { Signup } from "../components/Signup";

function RootSignupPage() {
  const { checkRoot } = useAuthStore();

  useEffect(() => {
     checkRoot();
  }, [checkRoot]);
  return (
    <>
      <section className="w-full h-[100vh] flex justify-center items-center bg-gray-50">
        <Signup />
      </section>
    </>
  );
}
export default RootSignupPage;
