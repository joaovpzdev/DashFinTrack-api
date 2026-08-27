import 'dotenv/config.js'
import pg from 'pg'


const { Pool } = pg

 export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB
})

export const PostgresHelper = {
    query:  async (query, params) => {
    const client = await pool.connect()
    
    const results = await client.query(query, params)
    client.release()
    return results.rows
    }
}