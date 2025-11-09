import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationCode = async (toEmail, code) => {
  await resend.emails.send({
    from: 'fundi match <onboarding@resend.dev>', // dev mode sender
    to: toEmail,
    subject: 'Your Verification Code',
    html: `<p>Your verification code is <strong>${code}</strong></p>`,
  });
};
