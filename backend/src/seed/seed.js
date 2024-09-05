const  { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

const seed = async () => {
    const user = await prisma.user.findMany();
    console.log(user);
}

seed();