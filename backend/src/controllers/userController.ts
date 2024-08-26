import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../config/firebaseconfig';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from 'multer';


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const upload = multer({storage: multer.memoryStorage()});
const prisma = new PrismaClient();
export const uploadMiddleware = upload.single('profileImage');


export const getTests = async (req: Request, res: Response) => {
    try {
        const tests = await prisma.test.findMany({
            select: {
              id: true,
              name: true,
              timeSlot: true,
              usersAllowed: true,
              usersFilled: true,
              totalMarks: true,
            },
        });
          
        res.json(tests);
                  
    } catch (error) {
        res.status(500).json({ message: 'Error getting tests' });
    }
}

export const applyTest = async (req: Request, res: Response) => {
    const { testId, email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if(user.testApplied){
            return res.status(400).json({ message: 'User already applied for a test' });
        }

        const test = await prisma.test.findUnique({
            where: {
                id: testId,
            },
            select: {
                usersAllowed: true,
                usersFilled: true,
                timeSlot: true,
            },
        });
        if(test){
            if (test.usersFilled < test.usersAllowed) {
                await prisma.test.update({
                    where: {
                        id: testId,
                    },
                    data: {
                        usersFilled: test.usersFilled + 1,
                    },
                });

                await prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        testId,
                        testSlot: test.timeSlot,
                    },
                });


                res.json({ message: 'Test applied successfully' });
            } else {
                res.status(400).json({ message: 'Test is full' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error applying test' });
    }
}


export const signup = async (req: Request, res: Response) => {
    const { name, rollNo, branch, phone } = req.body;
    //@ts-ignore
    const email = req.user?.email;

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
                    (error) => {
                        console.error('Error during image upload:', error);
                        reject(error);
                    },
                    async () => {
                        try {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        } catch (error) {
                            console.error('Error getting download URL:', error);
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

        return res.json({ message: 'User created or updated successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating or updating user' });
    }
};
