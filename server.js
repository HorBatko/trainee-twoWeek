const  express = require('express');
const dotenv = require('dotenv');
const db = require('./src/db/db')
const branchRoutes =  require('./src/routes/branches')

dotenv.config()

const app = express()
const PORT = process.env.PORT 

app.use(express.json());
app.use('/branches', branchRoutes)

app.listen(PORT, ()=>{ console.log(`server start on port ${PORT}`)})
