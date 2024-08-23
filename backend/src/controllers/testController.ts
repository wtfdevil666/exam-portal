
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const startTest = async (req: Request, res: Response) => {
    const { testId,email } = req.body;

    try {

        const test = await prisma.test.findUnique({
            where: {
                id: testId,
            }
        });
        
        const currentTime = new Date();

        if (!test) {
            return res.status(400).json({ message: 'Test not found' });
        }

        const checkUser = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (!checkUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        if(!checkUser.testApplied){
            return res.status(400).json({ message: 'User has not applied for any test' });
        }

        if(checkUser.testId !== testId){
            return res.status(400).json({ message: 'User has not applied for this test' });
        }

        if(checkUser.testGiven && currentTime > test.endTime){
            return res.status(400).json({ message: 'User has already given the test' });
        }
        
        
        if (currentTime > test.timeSlot && currentTime < test.endTime){

            await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    testGiven: true,
                },
            });

            return res.status(200).json({
                message: 'Test started successfully',
                test
            });

        }
        
        return res.status(400).json({ message: 'Test has not started yet' });

    } catch (error) {
        res.status(500).json({ message: 'Error starting test' });
    }
}

export const submitTest = async (req: Request, res: Response) => {
    try {
        
        const { email, testId, mcqanswers, codes } = req.body;

        const test = await prisma.test.findUnique({
            where:{
                id:testId
            },
            include: {
                mcqs: true,
                codingQuestions: true
            }
        })

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!test){
            return res.status(400).json({
                error:"Test not found"
            })
        }
        
        if(!user){
            return res.status(400).json({
                error:"User not found"
            })
        }

        if(user.testId !== testId){
            return res.status(400).json({
                error:"User has not applied for this test"
            })
        }

        if(user.testGiven && !user.testSubmitted){
            
            let marks = 0;
            for (let i = 0; i < test.mcqs.length; i++) {
                if (test.mcqs[i].answer === mcqanswers[i]) {
                    marks += test.mcqs[i].marks;
                }
            }
            
            



            await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    testSubmitted: true,
                },
            });

            return res.status(200).json({ message: 'Test submitted successfully' });
        }else{
            return res.status(400).json({ message: 'User has not given the test yet' });
        }
    
    } catch (error) {
        
    }
}
