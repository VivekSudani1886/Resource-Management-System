const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.users.findMany();
    console.log('--- USERS ---');
    users.forEach(u => {
        console.log(`Email: ${u.email}, Birthdate: ${u.birthdate}, Type: ${typeof u.birthdate}`);
        if (u.birthdate) {
            console.log(`ISO: ${u.birthdate.toISOString()}`);
            console.log(`Date String: ${u.birthdate.toDateString()}`);
        }
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
