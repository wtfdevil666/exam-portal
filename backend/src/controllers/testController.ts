import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Function to start the test
export const startTest = async (req: Request, res: Response) => {
    const { testSlotId, email } = req.body;

    try {
        const testSlot = await prisma.testSlot.findUnique({
            where: { id: testSlotId },
            include: { test: true }
        });

        const currentTime = new Date();

        if (!testSlot) {
            return res.status(400).json({ message: 'Test slot not found' });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.testApplied || user.testSlotId !== testSlotId) {
            return res.status(400).json({ message: 'User has not applied for this test slot' });
        }

        if (user.testGiven) {
            return res.status(400).json({ message: 'User has already given the test' });
        }

        // Ensure the test starts within the allocated time slot
        if (currentTime > testSlot.timeSlot && currentTime < testSlot.endTime) {
            await prisma.user.update({
                where: { email },
                data: { testGiven: true }
            });

            return res.status(200).json({
                message: 'Test started successfully',
                test: testSlot.test,
                timeSlot: testSlot.timeSlot,
                endTime: testSlot.endTime
            });
        }

        return res.status(400).json({ message: 'Test has not started yet or has ended' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error starting test' });
    }
};

// Function to submit the test
export const submitTest = async (req: Request, res: Response) => {
    const { email, testSlotId, mcqAnswers, codeSolutions } = req.body;

    try {
        const testSlot = await prisma.testSlot.findUnique({
            where: { id: testSlotId },
            include: {
                mcqs: true,
                codingQuestions: true
            }
        });

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!testSlot) {
            return res.status(400).json({ message: 'Test slot not found' });
        }

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.testSlotId !== testSlotId) {
            return res.status(400).json({ message: 'User has not applied for this test slot' });
        }

        if (!user.testGiven || user.testSubmitted) {
            return res.status(400).json({ message: 'User has not given the test or has already submitted' });
        }

        // Evaluate the MCQ answers
        let mcqMarks = 0;
        for (let i = 0; i < testSlot.mcqs.length; i++) {
            if (testSlot.mcqs[i].answer === mcqAnswers[i]) {
                mcqMarks += testSlot.mcqs[i].marks;
            }
        }

        // Evaluate the coding questions (assuming codeSolutions is an array of solutions)
        // You need to implement your own logic for evaluating coding questions.
        // Let's assume `evaluateCodeSolution` is a function that returns marks for coding questions
        // let codeMarks = 0;
        // for (let i = 0; i < testSlot.codingQuestions.length; i++) {
        //     codeMarks += await evaluateCodeSolution(testSlot.codingQuestions[i], codeSolutions[i]);
        // }

        // Calculate total marks
        const totalMarks = mcqMarks;

        // Update user status and marks
        await prisma.user.update({
            where: { email },
            data: {
                testSubmitted: true,
                marks: totalMarks
            }
        });

        return res.status(200).json({ 
            message: 'Test submitted successfully',
            totalMarks 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting test' });
    }
};

// Dummy function for evaluating coding questions
// async function evaluateCodeSolution(codingQuestion, codeSolution) {
//     // Custom logic to evaluate code solutions
//     // For now, let's return a random score as a placeholder
//     return Math.floor(Math.random() * codingQuestion.maxMarks);
// }
