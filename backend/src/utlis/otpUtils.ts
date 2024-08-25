import { sendMail } from './nodemailerConfig';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  const subject = 'Your OTP Code';
  const text = `Your OTP code is ${otp}. It will expire in 5 minutes.`;

  await sendMail(email, subject, text);
};
