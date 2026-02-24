import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import urlRouter from './routes/url.routes.js';
import { authenticationMiddleware } from './middlewares/auth.middleware.js';

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
app.use(authenticationMiddleware);
app.use(express.urlencoded({ extended: true }));



app.use('/api/users', userRouter);
app.use('/api', urlRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
