import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRouter from './routes/adminRoutes';
import userRouter from './routes/userRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }
);