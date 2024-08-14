'use server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchRequests() {
  const requests = await prisma.request.findMany();
  return requests;
}
