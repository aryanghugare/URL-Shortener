import express from 'express';
import { shortenCode } from '../controllers/url.controllers.js';
import { authenticationMiddleware, ensureAuthenticated } from '../middlewares/auth.middleware.js';



const router = express.Router();
router.post('/shorten', ensureAuthenticated , shortenCode);
router.get('/codes', ensureAuthenticated, getUserCodes);