import { pool } from '../db/db.js';

export const getBranches = async (req, res) => {
  const result = await pool.query('SELECT * FROM branches');
  res.status(200).json(result.rows);
}

export const postBranches = async (req, res) => {
    const { name, currency, timezone } = req.body;

    if (!name || !currency || !timezone) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const result = await pool.query(`INSERT INTO branches (name, currency, timezone) VALUES ($1, $2, $3) RETURNING *`,
      [name, currency, timezone]
      );
    res.status(201).json(result.rows[0]);
  }