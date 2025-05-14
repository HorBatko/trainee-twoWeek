const express = require('express');
const router = express.Router();
const db = require('../db/db');


router.post('/', async (req, res) => {
    try {
        const { branch_id, amount, category, local_datetime } = req.body

        if (!branch_id || !amount || !category || !local_datetime) {
            return res.status(400).send('Missing some kind of data');
        }

        const branch = await db.query(
            `SELECT currency, timezone FROM branches WHERE id = $1`, [branch_id]
        );

        if (branch.rowCount === 0) return res.status(404).send('Missing branch')

            
        const result = await db.query(
            `INSERT INTO expenses (branch_id, amount, category, local_datetime)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
            [branch_id, amount, category, local_datetime]
        );

        res.status(201).json(result.rows[0]);
    } catch {

        console.error('error', err.message);
        res.status(500).send('Internal server error');

    }
})