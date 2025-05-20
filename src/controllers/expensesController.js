import { pool } from '../db/db.js';
import axios from 'axios';


const API_KEY = process.env.API_KEY;

export const convertUSD = async (fromCurrency, amount) => {
    const url = 'https://api.exchangerate.host/convert';
    const params = {
      from: fromCurrency,
      to: 'USD',
      amount,
      access_key: API_KEY
    };

    const res = await axios.get(url, { params });

    if (!res.data.success) {
      throw new Error(`Conversion failed: ${JSON.stringify(res.data)}`);
    }

    return res.data.result;
};

export const getExpenses = async (req, res) => {
    const result = await pool.query(`SELECT * FROM expenses`);
    res.status(200).json(result.rows);
};

export const postExpenses = async (req, res) => {
  const { branch_id, amount, category, local_datetime } = req.body;

  if (!branch_id || !amount || !category || !local_datetime) {
    return res.status(400).send('Missing required fields');
  }

    const branch = await pool.query('SELECT currency FROM branches WHERE id = $1', [branch_id]);
    if (branch.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    const currency = branch.rows[0].currency;
    const amount_usd = await convertUSD(currency, amount);

    const result = await pool.query(
      `INSERT INTO expenses (branch_id, amount, amount_usd, category, local_datetime)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [branch_id, amount, amount_usd, category, local_datetime]
    );

    res.status(201).json(result.rows[0]);
};

export const putExpenses = async (req, res) => {
  const { id } = req.params;
  const { branch_id, amount, category, local_datetime } = req.body;

  if (!branch_id || !amount || !category || !local_datetime) {
    return res.status(400).send('Missing required fields');
  }

  const branch = await pool.query('SELECT currency FROM branches WHERE id = $1', [branch_id]);
  if (branch.rows.length === 0) {
    return res.status(404).json({ error: 'Branch not found' });
  }

    const currency = branch.rows[0].currency;
    const amount_usd = await convertUSD(currency, amount);

    const result = await pool.query(
      `UPDATE expenses
       SET amount = $1, amount_usd = $2, category = $3, local_datetime = $4
       WHERE id = $5
       RETURNING *`,
      [amount, amount_usd, category, local_datetime, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    };

    res.status(200).json(result.rows[0]);
};

export const deleteExpenses = async (req, res) => {
  const { id } = req.params;

    const result = await pool.query(`DELETE FROM expenses WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
    res.status(500).json({ error: err.message });
};