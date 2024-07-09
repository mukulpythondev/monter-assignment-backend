// routes/bookRoutes.js
import express from 'express';
import { addReview, createBook, getAllBooks, getBookDetails } from '../controllers/bookController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/create', verifyToken, createBook);
router.get('/all', verifyToken, getAllBooks);
router.get('/details', verifyToken, getBookDetails); 
router.post('/review', verifyToken, addReview);

export default router;
