const { PrismaClient } = require('../src/generated/prisma'); // Adjust the path as necessary
const prisma = new PrismaClient();
module.exports = prisma;