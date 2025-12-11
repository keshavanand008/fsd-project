import { Resend } from "resend";
console.log("DEBUG RESEND KEY:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);


export default async function sendEmail({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("✅ EMAIL SENT:", result);
    return result;
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    throw err;
  }
}
