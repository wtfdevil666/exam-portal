import { firebaseConfig } from '../config/firebaseconfig';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const prisma = new PrismaClient();


export const signup = async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, rollNo, branch, phone, year } = req.body;
  
    // @ts-ignore
    const email = req.user?.email;
    console.log(req.user);
    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }
  
    // Validate the required fields
    if (!name || !rollNo || !branch || !phone || !year) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      let imageUrl: string | null = null;
  
      // Handle image upload if an image is provided
      if (req.file) {
        try {
          const file = req.file;
          const storageRef = ref(storage, `profileImages/${Date.now()}_${file.originalname}`); // Generate unique file name
  
          // Upload the file to Firebase Storage
          const uploadTask = uploadBytesResumable(storageRef, file.buffer);
  
          // Wait for the upload to complete and retrieve the download URL
          imageUrl = await new Promise<string | null>((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              null, // Progress handler (optional)
              (error) => {
                console.error('Image upload failed:', error);
                reject(null); // Return null on error
              },
              async () => {
                try {
                  const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(downloadUrl); // Resolve with download URL
                } catch (error) {
                  console.error('Error getting download URL:', error);
                  reject(null); // Return null on error
                }
              }
            );
          });
        } catch (error) {
          console.error('Error during image upload process:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }
      }
  
      // Upsert user data in the database
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          name,
          rollNo,
          branch,
          phone,
          year,
          signUp: true,
          imageurl:imageUrl, // Store imageUrl
        },
        create: {
          email,
          name,
          rollNo,
          branch,
          phone,
          year,
          signUp: true,
          imageurl:imageUrl, // Store imageUrl
        },
      });
  
      // Success response
      console.log('User created or updated successfully:', user);
      res.status(200).json({ message: 'User created or updated successfully', user });
    } catch (error) {
      console.error('Error in user signup:', error);
      res.status(500).json({ message: 'Error creating or updating user' });
    }
  };
  










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
