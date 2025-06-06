// React
import { useState } from "react";

// Component VerifyEmail Form
import VerifyEmail from "../components/Forms/VerifyEmail";
// Component ForgetPass Form
import ForgetPass from "../components/Forms/ForgetPass";

function ForgetPassPage() {
  // checks for otp verification status
  const [isVerified, setIsVerified] = useState(false);

  return (
    <>
      <div id="forgetPassPage">
        {/* Show verification page if not verified else show change password form */}
        {isVerified ? (
          <ForgetPass />
        ) : (
          <VerifyEmail
            componenType="forgetPassword"
            heading="Verify Email"
            setIsVerified={setIsVerified}
          />
        )}
      </div>
    </>
  );
}

export default ForgetPassPage;
