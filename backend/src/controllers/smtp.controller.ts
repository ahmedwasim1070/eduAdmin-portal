// Nodemailer
import nodemailer from "nodemailer";

// DotEnv
import "dotenv/config";

// Creates transporter payload for the nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
});

// Sends the otp to the user email
export const sendOtp = async (
  otp: string,
  userEmail: string
): Promise<boolean> => {
  try {
    // Email Payload
    await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: userEmail,
      subject: "Requested OTP code from eduAdmin-Portal",
      html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: rgba(255,255,255,0.95); padding: 30px; text-align: center; border-bottom: 3px solid #4a90e2;">
            <h1 style="color: #4a90e2; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">eduAdmin Portal</h1>
            <p style="color: #666; margin: 8px 0 0 0; font-size: 14px;">Account Verification</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: white; padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #333; margin: 0 0 12px 0; font-size: 24px; font-weight: 600;">Email Verification Required</h2>
              <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.5;">Hello <strong style="color: #4a90e2;">${userEmail}</strong>,</p>
              <p style="color: #666; margin: 12px 0 0 0; font-size: 16px; line-height: 1.5;">Please use the verification code below to confirm your account:</p>
            </div>
            
            <!-- OTP Code -->
            <div style="text-align: center; margin: 35px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #4a90e2, #357abd); color: white; padding: 20px 35px; border-radius: 12px; font-size: 32px; font-weight: 700; letter-spacing: 6px; box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3); border: 3px solid rgba(255,255,255,0.2);">
                ${otp}
              </div>
            </div>
            
            <!-- Security Notice -->
            <div style="background: #f8f9fa; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #856404; font-size: 14px; font-weight: 500;">
                🔒 <strong>Security Notice:</strong> This code expires in 5 minutes. Never share it with anyone.
              </p>
            </div>
            
          <!-- Footer -->
          <div style="background: #2c3e50; color: white; padding: 25px 30px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 12px; opacity: 0.8;">
              If you didn't request this verification, you can safely ignore this email.
            </p>
            <p style="margin: 0; font-size: 12px; opacity: 0.6;">
              © ${new Date().getFullYear()} eduAdmin Portal. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    // true if success
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    // false if error
    return false;
  }
};
