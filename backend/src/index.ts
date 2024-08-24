import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRouter from './routes/adminRoutes';
import userRouter from './routes/userRoutes';
import {Strategy} from "passport-google-oauth2";
import session from "express-session"
import passport from "passport";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
dotenv.config();
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    callbackURL: "/api/auth/oauth",
    scope: ["email", "profile"],
    passReqToCallback: true,
},
    async function (request:any, accessToken:any, refreshToken:any, profile:any, done:any) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: profile.email
                }
            });
            if (user) {
                return done(null, user);
            } else {
                const newUser = await prisma.user.create({
                    data: {
                        email: profile.email,
                        name: profile.displayName
                    }
                });
                return done(null, newUser);
            }        
        } catch (error) {
            return done(error,null);
        }
    }
));


passport.serializeUser((user:any, done:any) => {
    done(null, user);
});

passport.deserializeUser((user:any, done:any) => {
    done(null, user);
});

app.get('/api/auth/auth', passport.authenticate('google', { scope: ['email', 'profile'] }));    

app.get('/api/auth/oauth', passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/signin',
    successRedirect: 'http://localhost:5173/login'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*=================================================================*/ 

//Routes

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
// app.use('/api/auth', authRouter);

/*=================================================================*/ 

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }
);