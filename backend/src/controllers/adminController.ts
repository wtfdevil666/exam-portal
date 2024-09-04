import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createTest = async (req: Request, res: Response) => {
  try {
    const { name, year } = req.body;

    if (!name || !year) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const test = await prisma.test.create({
      data: {
        name,
        year
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
    const tests = await prisma.test.findMany({
      include: {
        testSlots: true,  // Includes associated test slots
      }
    });
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
        id
      },
      include: {
        testSlots: true
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
    const { name, year } = req.body;

    const test = await prisma.test.update({
      where: {
        id
      },
      data: {
        name,
        year
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
    const testSlotId = req.params.testSlotId;
    const { question, option1, option2, option3, option4, answer, marks } = req.body;

    const mcq = await prisma.mcq.create({
      data: {
        testId: testSlotId,
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
};

export const getMcqs = async (req: Request, res: Response) => {
  try {
    const { testSlotId } = req.params;
    const mcqs = await prisma.mcq.findMany({
      where: {
        testId: testSlotId
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
        id: mcqId
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
        id
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
    const testSlotId = req.params.testSlotId;
    const { difficulty, marks, title, description, sampleTestCase, sampleTestCaseOutput, testCases, testCasesOutput } = req.body;

    const coding = await prisma.codingQuestion.create({
      data: {
        testId: testSlotId,
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
};

export const getCodingQuestions = async (req: Request, res: Response) => {
  try {
    const codingQuestions = await prisma.codingQuestion.findMany({
      where: {
        testId: req.params.testSlotId
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
    const codingQuestionId = req.params.codingQuestionId;
    const coding = await prisma.codingQuestion.delete({
      where: {
        id: codingQuestionId
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
    const codingQuestionId = req.params.codingQuestionId;
    const { title, marks, description, sampleTestCase, sampleTestCaseOutput, testCases, testCasesOutput, difficulty } = req.body;

    const coding = await prisma.codingQuestion.update({
      where: {
        id: codingQuestionId
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
