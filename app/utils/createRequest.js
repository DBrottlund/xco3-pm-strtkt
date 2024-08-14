import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

  export async function createRequest(
    title,
    createdById,
    dueAfterTimeId,
    turnaroundTimeId,
    assigneeId = null,
    assignedById = null,
    requestIntro = null,
    requestOutro = null,
    requestOriginal = null,
    requestAIProcessed = null,
    completedAt = null,
    percentComplete = 0,
    startedAt = null,
    completedTasks = [],
    productTags = [],
    initiativesTags = []
  ) {
    const request = await prisma.request.create({
      data: {
        title,
        createdById,
        dueAfterTimeId,
        turnaroundTimeId,
        assigneeId,
        assignedById,
        requestIntro,
        requestOutro,
        requestOriginal,
        requestAIProcessed,
        completedAt,
        percentComplete,
        startedAt,
        completedTasks,
        productTags,
        initiativesTags,
      },
    });
  
    return request;
  }


