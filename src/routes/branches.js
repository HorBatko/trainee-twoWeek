import express from 'express';
import { getBranches, postBranches } from '../controllers/branchesController.js';
import {ctrlWrapper} from'../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/',  ctrlWrapper(getBranches));
router.post('/', ctrlWrapper(postBranches));

export default router;