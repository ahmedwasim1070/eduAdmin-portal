import { generateSecurePin } from "../lib/util.js";
import { transporter } from "../lib/util.js";

export const mailOTP = async (email: string): Promise<string> => {
  const otp = generateSecurePin();

  const otpTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f4f4f4; border-radius: 8px;">
      <div style="background: #ffffff; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="color: #333;">You requested OTP from eduAdmin.portal.app</h2>
        <p style="color: #555; font-size: 16px;">
          Hello 👋,<br /><br />
          Thank you for signing up with <strong>EduAdmin Portal</strong>.<br />
          Please use the following verification code to complete your registration:
        </p>
        <div style="margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #007bff;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 14px;">
          This code will expire in 5 minutes. If you didn’t request this, you can safely ignore it.
        </p>
      </div>
      <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
        © ${new Date().getFullYear()} EduAdmin Portal. All rights reserved.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Support | EduAdmin Portal" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: "Requested OTP from eduAdmin portal",
    html: otpTemplate,
  });

  return otp;
};
