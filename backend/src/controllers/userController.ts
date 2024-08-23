import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

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