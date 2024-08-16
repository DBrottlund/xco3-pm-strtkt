'use server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchRequests() {
  const requests = await prisma.request.findMany({
    include: {
      tasks: true, // Include all tasks related to the request
      dueAfterTime: true, // Include the dueAfterTime relation data
      turnaroundTime: true, // Include the turnaroundTime relation data
      assignee: true, // Include the assignee user data
      assignedBy: true, // Include the assignedBy user data
      createdBy: true, // Include the createdBy user data
      changeLog: true, // Include the changeLog entries
    
    },
  });
  return requests;
}
