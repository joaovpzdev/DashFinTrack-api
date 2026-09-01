import { execSync } from 'child_process';

async function init() {
    execSync('docker compose up -d --wait postgres_test', { stdio: 'pipe' })
    execSync('npx prisma db push', { stdio: 'pipe' })
}
export default init;