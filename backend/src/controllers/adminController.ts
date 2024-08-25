import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createTest = async (req: Request, res: Response) => {
  try {
    const { name, timeSlot, usersAllowed, totalMarks, endTime} = req.body;

    if (!name || !timeSlot || !usersAllowed || !totalMarks) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const test = await prisma.test.create({
      data: {
        name,
        timeSlot: new Date(timeSlot),
        endTime: new Date(endTime), 
        usersAllowed,
        totalMarks
      }
    });

    res.status(201).json({ message: 'Test created successfully', test });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


export const getTests = async (req: Request, res: Response) => {
    try {
        const tests = await prisma.test.findMany();
        res.status(200).json({ tests });
    } catch (error) {
        console.error('Error getting tests:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const deleteTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const test = await prisma.test.delete({
            where: {
                id: id as string
            }
        });
        res.status(200).json({ message: 'Test deleted successfully', test });
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const updateTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, timeSlot, usersAllowed, totalMarks } = req.body;

        const test = await prisma.test.update({
            where: {
                id: id as string
            },
            data: {
                name,
                timeSlot: new Date(timeSlot),
                usersAllowed,
                totalMarks
            }
        });

        res.status(200).json({ message: 'Test updated successfully', test });
    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const addMcq = async (req: Request, res: Response) => {
    try {
        const testId = req.params.testId;
        const {  question, option1,option2,option3,option4, answer, marks } = req.body;

        const mcq = await prisma.mcq.create({
            data: {
                testId,
                question,
                option1,
                option2,
                option3,
                option4,
                marks,
                answer
            }
        });

        res.status(201).json({ message: 'MCQ added successfully', mcq });
    } catch (error) {
        console.error('Error adding MCQ:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export const getMcqs = async (req: Request, res: Response) => {
    try {
        const { testId } = req.params;
        const mcqs = await prisma.mcq.findMany({
            where: {
                testId: testId as string
            }
        });
        res.status(200).json({ mcqs });
    } catch (error) {
        console.error('Error getting MCQs:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const deleteMcq = async (req: Request, res: Response) => {
    try {
        const mcqId = req.params.mcqId;
        const mcq = await prisma.mcq.delete({
            where: {
                id: mcqId as string
            }
        });
        res.status(200).json({ message: 'MCQ deleted successfully', mcq });
    } catch (error) {
        console.error('Error deleting MCQ:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const updateMcq = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { question, option1, option2, option3, option4, answer, marks } = req.body;

        const mcq = await prisma.mcq.update({
            where: {
                id: id as string
            },
            data: {
                question,
                option1,
                option2,
                option3,
                option4,
                answer,
                marks
            }
        });

        res.status(200).json({ message: 'MCQ updated successfully', mcq });
    } catch (error) {
        console.error('Error updating MCQ:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const addCodingQuestion = async (req: Request, res: Response) => {
    try {
        const testId = req.params.testId;
        const { difficulty, marks, title, description, sampleTestCase, sampleTestCaseOutput, testCases, testCasesOutput, } = req.body;

        const coding = await prisma.codingQuestion.create({
            data: {
                testId,
                title,
                marks,
                description,
                sampleTestCase,
                sampleTestCaseOutput,
                testCases,
                testCasesOutput,
                difficulty
            }
        });

        res.status(201).json({ message: 'Coding question added successfully', coding });
    } catch (error) {
        console.error('Error adding coding question:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export const getCodingQuestions = async (req: Request, res: Response) => {
    try {
        const codingQuestions = await prisma.codingQuestion.findMany({
            where: {
                testId: req.params.testId as string
            }
        });

        res.status(200).json({ codingQuestions });
    } catch (error) {
        console.error('Error getting coding questions:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


export const deleteCodingQuestion = async (req: Request, res: Response) => {
    try {
        const {codingQuestionId} = req.params;
        const coding = await prisma.codingQuestion.delete({
            where: {
                id: codingQuestionId as string
            }
        });
        res.status(200).json({ message: 'Coding question deleted successfully', coding });
    } catch (error) {
        console.error('Error deleting coding question:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const updateCodingQuestion = async (req: Request, res: Response) => {
    try {
        const {codingQuestionId} = req.params;
        const { title, marks, description, sampleTestCase, sampleTestCaseOutput, testCases, testCasesOutput, difficulty } = req.body;

        const coding = await prisma.codingQuestion.update({
            where: {
                id: codingQuestionId as string
            },
            data: {
                title,
                marks,
                description,
                sampleTestCase,
                sampleTestCaseOutput,
                testCases,
                testCasesOutput,
                difficulty
            }
        });

        res.status(200).json({ message: 'Coding question updated successfully', coding });
    } catch (error) {
        console.error('Error updating coding question:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};