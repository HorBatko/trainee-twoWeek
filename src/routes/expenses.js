import express from 'express';
import { deleteExpenses, getExpenses, postExpenses, putExpenses } from '../controllers/expensesController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getExpenses));
router.post('/', ctrlWrapper(postExpenses));
router.put('/:id', ctrlWrapper(putExpenses));
router.delete('/:id', ctrlWrapper(deleteExpenses));

export default router;