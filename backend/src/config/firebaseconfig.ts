import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Ensure that all necessary environment variables are set
if (!process.env.apiKey || 
    !process.env.authDomain || 
    !process.env.projectId || 
    !process.env.storageBucket || 
    !process.env.messagingSenderId || 
    !process.env.appId) {
    throw new Error("Missing Firebase configuration in environment variables");
}

export const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId || "", // Optional
};
