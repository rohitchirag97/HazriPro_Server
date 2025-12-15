import { Resend } from "resend";
import { VerificationEmail } from "../emails/verification-email.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  email,
  name,
  otp,
}: {
  email: string;
  name?: string;
  otp: string;
}) => {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  
  try {
    const emailProps: { name?: string; otp: string } = {
      otp,
    };
    if (name) {
      emailProps.name = name;
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail(emailProps),
    });

    if (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
};

