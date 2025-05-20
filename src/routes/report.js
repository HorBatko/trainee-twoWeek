import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getReport } from '../controllers/reportControllers.js'; 

const router = express.Router();

router.get('/:month',  ctrlWrapper(getReport));

export default router;