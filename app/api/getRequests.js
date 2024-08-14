// pages/api/getRequests.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const requests = await prisma.request.findMany();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching requests' });
  } finally {
    await prisma.$disconnect();
  }
}
