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
        const files = fs.readdirSync(_dirname).filter(file => file.endsWith('.sql'))
        for (const file of files) {

            const filePath = path.join(_dirname, file)
            
            const script = fs.readFileSync(filePath, 'utf8')
            
            await client.query(script)

            console.log(`Executed migration: ${file}`)
        }


    console.log('Migrations executed successfully!')
    } catch (error) {
        console.error('Error executing migrations:', error)
    } finally {
        await client.release()
    }
}

execMigrations()