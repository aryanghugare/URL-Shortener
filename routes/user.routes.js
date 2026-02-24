import express from 'express';
import { signup } from '../controllers/user.controllers';

const router = express.Router();


router.post('/signup', signup)




export default router;