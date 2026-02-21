import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
    // many options to explore 
}))

app.use(cookieParser());
app.use(express.json());

 

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});
