import { pool } from '../db/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const getReport = async (req, res) => {
    
    const {month} = req.params

    if (!month) {
        return res.status(400).send('Missing reported fields');
    }

    const startDate = `2025-${month}-01`;
    const endDate = `2025-${month}-31`;

    const totalAmount = await pool.query(`
        SELECT SUM(amount_usd) AS total_usd
       FROM expenses
       WHERE local_datetime BETWEEN $1 AND $2
        `, [startDate,endDate])

    // const planBranches = await pool.query(`
    //     SELECT 
    
    //     `,[])
 
    res.status(200).json({
        totalAmount: totalAmount.rows,
    });
}