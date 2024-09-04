import { firebaseConfig } from '../config/firebaseconfig';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from 'multer';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const upload = multer({ storage: multer.memoryStorage() });
const prisma = new PrismaClient();
export const uploadMiddleware = upload.single('profileImage');

// Fetch all tests
export const getTests = async (req: Request, res: Response) => {
    try {
        const tests = await prisma.test.findMany({
            select: {
                id: true,
                name: true,
                year: true,
                testSlots: {
                    select: {
                        id: true,
                        timeSlot: true,
                        usersAllowed: true,
                        usersFilled: true,
                        totalMarks: true
                    }
                }
            }
        });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Error getting tests' });
    }
};

// Apply for a test
export const applyTest = async (req: Request, res: Response) => {
    const { testSlotId } = req.params;
    //@ts-ignore
    const email = req.user!.email;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.testApplied) {
            return res.status(400).json({ message: 'User already applied for a test' });
        }

        const testSlot = await prisma.testSlot.findUnique({
            where: { id: testSlotId },
            select: {
                usersAllowed: true,
                usersFilled: true,
                timeSlot: true
            }
        });

        if (testSlot && testSlot.usersFilled < testSlot.usersAllowed) {
            await prisma.testSlot.update({
                where: { id: testSlotId },
                data: { usersFilled: testSlot.usersFilled + 1 }
            });

            await prisma.user.update({
                where: { email },
                data: {
                    testSlotId: testSlotId,
                    testApplied: true,
                }
            });

            res.json({ message: 'Test applied successfully' });
        } else {
            res.status(400).json({ message: 'Test is full' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error applying test' });
    }
};

// Signup with profile image upload
export const signup = async (req: Request, res: Response) => {
    const { name, rollNo, branch, phone } = req.body.formData;
    //@ts-ignore
    const email = req.user.email;

    if (!email) {
        return res.status(400).json({ message: 'User email is required' });
    }

    try {
        let imageUrl: string | null = null;

        if (req.file) {
            const file = req.file;
            const storageRef = ref(storage, `profileImages/${file.originalname}`);
            const uploadTask = uploadBytesResumable(storageRef, file.buffer);

            await new Promise<void>((resolve, reject) => {
                uploadTask.on('state_changed', 
                    () => {}, 
                    (error) => reject(error), 
                    async () => {
                        try {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });
        }

        const user = await prisma.user.upsert({
            where: { email },
            update: { name, rollNo, branch, phone, signUp: true, imageurl: imageUrl },
            create: { email, name, rollNo, branch, phone, signUp: true, imageurl: imageUrl },
        });

        res.json({ message: 'User created or updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating or updating user' });
    }
};

// Login check
export const login = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const email = req.user.email;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user?.signUp) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(200).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};
