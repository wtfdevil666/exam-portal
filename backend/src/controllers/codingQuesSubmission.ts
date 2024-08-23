import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import axios from "axios";

const prisma = new PrismaClient();

const url = process.env.CODING_API_URL!;


const compilerHandler = async (req:Request,res:Response) => {

    const { email,code,languageId,questionId } = req.body;

    const question = await prisma.codingQuestion.findUnique({
        where: {
            id: questionId,
        }
    })

    if(!question){
        return res.status(400).json({
            error:"Question not found"
        })
    }

    const input = question?.testCases;
    const output = question?.testCasesOutput;
    
    const data = {
        source_code: code,  
        language_id: languageId,
        number_of_runs: null,
        stdin: input,
        expected_output: output,  
        cpu_time_limit: null,
        cpu_extra_time: null,
        wall_time_limit: null,
        memory_limit: null,
        stack_limit: null,
        max_processes_and_or_threads: null,
        enable_per_process_and_thread_time_limit: null,
        enable_per_process_and_thread_memory_limit: null,
        max_file_size: null,
        enable_network: null,
        base64_encoded: true
    };

    try {
        const response = await axios.post(url, data);
        const token = response.data.token;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        let result;
        let status;
        do {
            result = await axios.get("http://13.202.142.107:2358"+"/submissions/"+token);
            status = result.data.status.description;
        } while (status === "Processing");

        

        if(status === "Accepted"){
            const user = await prisma.user.findUnique({
                where: {
                    email,
                }
            })
            if(!user){
                return res.status(400).json({
                    error:"User not found"
                })
            }
            await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    marks: user.marks + question.marks,
                },
            });


        }

        return res.json({
            status,
            stdout: result.data.stdout,
            stderr: result.data.stderr,
            compile_output: result.data.compile_output,
            message: result.data.message
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong or Compilation Error' });
    }

}   