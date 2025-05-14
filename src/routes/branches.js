const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req,res)=>{
    try{
        const allBranches = await db.query(
            `SELECT id, name, currency, timezone FROM branches`
        )
        res.status(201).json(allBranches.rows)
    }catch{ 
        res.status(500).send('server error');
    }
})

router.post('/', async (req, res) => {

    try {

        const { name, currency, timezone } = req.body;

        if (!name || !currency || !timezone) {
            return res.status(400).send('Missing some kind of data');
        }

        const result = await db.query(
            `INSERT INTO branches (name, currency, timezone) VALUES ($1, $2, $3) RETURNING *`,
            [name, currency, timezone]
        );

        res.status(201).json(result.rows);

    } catch (err) {
        
        console.error('error in POST /branches', err.message);
        res.status(500).send('Internal server error');

    }
});



module.exports = router;