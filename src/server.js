import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import branchRoutes from './routes/branches.js';
import expensesRoters from './routes/expenses.js';
import reportRouters from './routes/report.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';


const app = express();

app.use(express.json());
app.use('/branches', branchRoutes);
app.use('/expenses', expensesRoters);
app.use('/report', reportRouters);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
