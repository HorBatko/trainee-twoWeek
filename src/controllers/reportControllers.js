import { pool } from "../db/db.js";

export const getReport = async (req, res) => {
  const { month } = req.params;

  if (!month) {
    return res.status(400).send("Missing reported fields");
  }

  const startDate = `2025-${month}-01`;
  const endDate = `2025-${month}-31`;

  const totalAmount = await pool.query(
    `
       SELECT SUM(amount_usd) AS total_usd

       FROM expenses
       WHERE local_datetime BETWEEN $1 AND $2
        `,
    [startDate, endDate]
  );

  const planBranches = await pool.query(`
    SELECT 
    branches.name AS branch_name,
    branches.budget_usd,
    ROUND(SUM(expenses.amount_usd), 2) AS spent_usd
    FROM branches
    LEFT JOIN expenses 
    ON branches.id = expenses.branch_id 
    AND expenses.local_datetime BETWEEN $1 AND $2
    GROUP BY branches.id, branches.name, branches.budget_usd
    ORDER BY branches.id;
`, [startDate, endDate]);

  res.status(200).json({
    totalAmount: totalAmount.rows,
    planBranches: planBranches.rows,
  });
};
