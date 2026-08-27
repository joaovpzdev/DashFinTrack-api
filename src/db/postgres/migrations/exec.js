import 'dotenv/config.js'
import { pool } from '../helper.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

const execMigrations = async () => {
     const client = await pool.connect()
    try{
        const filePath = path.join(_dirname, '01-init.sql')
    const script = fs.readFileSync(filePath, 'utf8')

   
    await client.query(script)

    console.log('Migrations executed successfully!')
    } catch (error) {
        console.error('Error executing migrations:', error)
    } finally {
        await client.release()
    }
}

execMigrations()