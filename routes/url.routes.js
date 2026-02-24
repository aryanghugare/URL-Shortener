import express from 'express';
import { shortenCode , getUserCodes , getOriginalURL } from '../controllers/url.controller.js';
import { authenticationMiddleware, ensureAuthenticated } from '../middlewares/auth.middleware.js';


// Authenticated routes
const router = express.Router();
router.post('/shorten', ensureAuthenticated , shortenCode);
router.get('/codes', ensureAuthenticated, getUserCodes);
// Public route 
router.get('/:shortCode',getOriginalURL);

export default router;