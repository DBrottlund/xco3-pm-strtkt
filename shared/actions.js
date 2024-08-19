'use server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchRequests() {
  const requests = await prisma.request.findMany({
    include: {
      tasks: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      dueAfterTime: true,
      turnaroundTime: true,
      assignee: true,
      assignedBy: true,
      createdBy: true,
      changeLog: true,
    },
  });
  return requests;
}

export async function fetchUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function updateRequest(id, data) {
  console.log("Received data:", data);
  try {
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        title: data.title,
        requestIntro: data.requestIntro,
        requestOutro: data.requestOutro,
        requestOriginal: data.requestOriginal,
        requestAIProcessed: data.requestAIProcessed,
        percentComplete: data.percentComplete,
        status: data.status,
        completedTasks: data.completedTasks,

        assignee: data.assigneeId ? { connect: { id: data.assigneeId } } : undefined,
        assignedBy: data.assignedById ? { connect: { id: data.assignedById } } : undefined,

        assigneeType: data.assigneeType,
        productTags: data.productTags,
        initiativesTags: data.initiativesTags,
        dueAfterTime: {
          update: {
            timeUnit: data.dueAfterTime.timeUnit,
            timeNumber: data.dueAfterTime.timeNumber,
          },
        },
        turnaroundTime: {
          update: {
            timeUnit: data.turnaroundTime.timeUnit,
            timeNumber: data.turnaroundTime.timeNumber,
          },
        },
       
      },
      include: {
        dueAfterTime: true,
        turnaroundTime: true,
        assignee: true,
        assignedBy: true,
        createdBy: true,
      },
    });

    return updatedRequest;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
}

export async function saveRequest(data) {
  try {
    const newRequest = await prisma.request.create({
      data: {
        title: data.title,
        requestIntro: data.requestIntro,
        requestOutro: data.requestOutro,
        requestOriginal: data.requestOriginal,
        requestAIProcessed: data.requestAIProcessed,
        percentComplete: data.percentComplete,
        status: data.status,
        completedTasks: data.completedTasks,
        assigneeId: data.assigneeId,
        assignedById: data.assignedById,
        createdById: data.createdById,
        assigneeType: data.assigneeType,
        productTags: data.productTags,
        initiativesTags: data.initiativesTags,
        dueAfterTime: {
          create: {
            timeUnit: data.dueAfterTime.timeUnit,
            timeNumber: data.dueAfterTime.timeNumber,
          },
        },
        turnaroundTime: {
          create: {
            timeUnit: data.turnaroundTime.timeUnit,
            timeNumber: data.turnaroundTime.timeNumber,
          },
        },
        tasks: {
          create: data.tasks.map(task => ({
            title: task.title,
            taskText: task.taskText,
          })),
        },
      },
      include: {
        tasks: true,
        dueAfterTime: true,
        turnaroundTime: true,
        assignee: true,
        assignedBy: true,
        createdBy: true,
      },
    });

    return newRequest;
  } catch (error) {
    console.error('Error saving new request:', error);
    throw error;
  }
}



export async function deleteRequest(id) {
  try {
    const deletedRequest = await prisma.request.delete({
      where: { id },
    });
    return deletedRequest;
  } catch (error) {
    console.error("Error deleting request:", error);
    throw error;
  }
}

export async function fetchTasks(requestId) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        requestId: requestId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return { success: true, data: tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: 'Failed to fetch tasks' };
  }
}

export async function createTasks(tasks) {
  console.log("Received tasks:", tasks);
  try {
    // Remove the 'id' field from each task if it exists
    const tasksToCreate = tasks.map(({ id, ...task  }) => task);

    const createdTasks = await prisma.task.createMany({
      data: tasksToCreate
    });
    
    // Fetch the newly created tasks to get their IDs
    const newTasks = await prisma.task.findMany({
      where: {
        OR: tasksToCreate.map(task => ({
          title: task.title,
          taskText: task.taskText,
          requestId: task.requestId
        }))
      }
    });

    // Update the percentComplete for the associated request
    if (newTasks.length > 0 && newTasks[0].requestId) {
      await updateRequestPercentComplete(newTasks[0].requestId);
    }
    
    return { success: true, data: newTasks };
  } catch (error) {
    console.error('Error creating tasks:', error);
    return { success: false, error: 'Failed to create tasks' };
  }
}

export async function deleteTask(taskId) {
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId
      }
    });
    
    // Update the percentComplete for the associated request
    if (deletedTask.requestId) {
      await updateRequestPercentComplete(deletedTask.requestId);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}

export async function updateTask(taskId, updateData) {
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId
      },
      data: updateData,
      include: {
        request: true
      }
    });
    
    // Update the percentComplete for the associated request
    if (updatedTask.requestId) {
      await updateRequestPercentComplete(updatedTask.requestId);
    }
    
    return { success: true, data: updatedTask };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
  }
}

async function updateRequestPercentComplete(requestId) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        requestId: requestId
      }
    });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completedAt !== null).length;
    const percentComplete = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    await prisma.request.update({
      where: {
        id: requestId
      },
      data: {
        percentComplete: Math.round(percentComplete)
      }
    });
  } catch (error) {
    console.error('Error updating request percentComplete:', error);
  }
}