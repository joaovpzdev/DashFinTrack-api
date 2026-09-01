import { execSync } from 'child_process';

async function init() {
    execSync('docker compose up -d postgres_test', { stdio: 'inherit' })
    execSync('npx prisma db push')
}
export default init;