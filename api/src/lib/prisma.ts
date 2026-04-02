import { PrismaClient } from '@prisma/client';

// Shared singleton — avoids multiple PrismaClient instances across modules
const prisma = new PrismaClient();

export default prisma;
