import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { generateOTP, sendOTP } from '../utlis/otpUtils';
import { addMinutes } from 'date-fns';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_TIME = 15;
const OTP_EXPIRY_TIME = 5;

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = '23h'; 

export const adminLogin = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!otp) {
      if (admin.otpAttempts >= RATE_LIMIT_ATTEMPTS && admin.otpRateLimitResetAt && admin.otpRateLimitResetAt > new Date()) {
        return res.status(429).json({ message: 'Too many OTP attempts, please try again later' });
      }

      const generatedOTP = generateOTP();
      const otpExpiresAt = addMinutes(new Date(), OTP_EXPIRY_TIME);

      await prisma.admin.update({
        where: { email },
        data: {
          otp: generatedOTP,
          otpExpiresAt,
          otpAttempts: admin.otpAttempts + 1,
          otpLastAttemptAt: new Date(),
          otpRateLimitResetAt: admin.otpAttempts + 1 >= RATE_LIMIT_ATTEMPTS
            ? addMinutes(new Date(), RATE_LIMIT_TIME)
            : admin.otpRateLimitResetAt,
        },
      });

      await sendOTP(email, generatedOTP);

      return res.status(200).json({ message: 'OTP sent to email' });
    }

    if (otp) {
      if (admin.otpExpiresAt && new Date() > admin.otpExpiresAt) {
        return res.status(400).json({ message: 'OTP expired' });
      }

      if (otp === admin.otp) {
        await prisma.admin.update({
          where: { email },
          data: {
            otp: null,
            otpExpiresAt: null,
            otpAttempts: 0,
            otpRateLimitResetAt: null,
          },
        });

        const token = jwt.sign(
          { id: admin.id, email: admin.email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRY }
        );

        return res.status(200).json({ 
          message: 'Login successful',
          token,  
        });

      } else {
        await prisma.admin.update({
          where: { email },
          data: {
            otpAttempts: admin.otpAttempts + 1,
            otpLastAttemptAt: new Date(),
            otpRateLimitResetAt: admin.otpAttempts + 1 >= RATE_LIMIT_ATTEMPTS
              ? addMinutes(new Date(), RATE_LIMIT_TIME)
              : admin.otpRateLimitResetAt,
          },
        });

        return res.status(400).json({ message: 'Invalid OTP' });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const isAdminLogined = (req: Request, res: Response) => {
    const user = req.user;
    return res.status(200).json({ message: 'Admin is logined', user });
}