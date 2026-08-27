import 'dotenv/config.js'
import express from 'express'
import {PostgresHelper} from './src/db/postgres/helper.js'


const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
    const results = await PostgresHelper.query('SELECT * FROM users;', [])
    res.send(JSON.stringify(results))
})

app.post('/users', async (req, res) => {
    console.log(req.body)
    console.log(req.headers)
    res.status(201).send('User created successfully')
})



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})