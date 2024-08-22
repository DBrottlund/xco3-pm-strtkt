'use server'
import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { revalidatePath } from "next/cache";
import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';



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
      assigneeHistory: {
        include: {
          user: true
        },
        orderBy: {
          position: 'asc'
        }
      },
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

export async function setStatus(requestId, newStatus, user) {

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update the request status
      const updatedRequest = await prisma.request.update({
        where: { id: requestId },
        data: { 
          status: newStatus,
          // If the new status is COMPLETED, set the completedAt timestamp
          ...(newStatus === 'Completed' && { completedAt: new Date() }),
        },
      });

      // Create a log entry for this status change
      const logEntry = await prisma.log.create({
        data: {
          requestId: requestId,
          action: 'STATUS_CHANGE',
          details: `Status changed to ${newStatus} by user ${user.firstName} ${user.lastName} (${user.email})`,
        },
      });

      return { updatedRequest, logEntry };
    });

    // Revalidate the paths where requests and logs are displayed
    revalidatePath("/dashboard", "page");

    return { success: true, result };
  } catch (error) {
    console.error('Error setting status:', error);
    return { success: false, error: 'Failed to set status' };
  }
}



export async function updateRequest(id, data) {
  console.log("Received data:", data);
  try {
    // First, fetch the current request to get the current assignee history length
    const currentRequest = await prisma.request.findUnique({
      where: { id },
      include: { assigneeHistory: true }
    });

    const newPosition = currentRequest.assigneeHistory.length;

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
        
        // Always update assignee history when there's a new assignee
        ...(data.assigneeId && data.assigneeId !== currentRequest.assigneeId
          ? {
            assigneeHistory: {
              create: {
                userId: data.assigneeId,
                position: newPosition
              }
            }
          }
          : {}),
      },
      include: {
        dueAfterTime: true,
        turnaroundTime: true,
        assignee: true,
        assignedBy: true,
        createdBy: true,
        assigneeHistory: {
          include: {
            user: true
          },
          orderBy: {
            position: 'asc'
          }
        },
      },
    });

    return updatedRequest;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
}


export async function saveRequest(data) {
  console.log("Received data:", data);
  try {
    const newRequest = await prisma.request.create({
      data: {
        title: data.title,
        requestIntro: data?.requestIntro,
        requestOutro: data?.requestOutro,
        requestOriginal: data?.requestOriginal,
        requestAIProcessed: data?.requestAIProcessed,
        percentComplete: data.percentComplete || 0,
        status: data.status || "Request",
        startedAt: data.startedAt || DateTime.now().setZone('America/Chicago').toJSDate(),
        completedTasks: data.completedTasks || [],
        assignee: data.assigneeId ? { connect: { id: data.assigneeId } } : undefined,
        assignedBy: data.assignedById ? { connect: { id: data.assignedById } } : undefined,
        createdBy: { connect: { id: data.createdById } },
        assigneeType: data.assigneeType || "USER",
        productTags: data.productTags || [],
        dueAfterTime: {
          create: {
            timeUnit: data.dueAfterTime.timeUnit,
            timeNumber: data.dueAfterTime.timeNumber,
          },
        },
        turnaroundTime: {
          create: {
            timeUnit: data?.turnaroundTime.timeUnit,
            timeNumber: data?.turnaroundTime.timeNumber,
          },
        },
        // Add the initial assignee to the assignee history
        assigneeHistory: data.assigneeId ? {
          create: {
            userId: data.assigneeId,
            position: 0  // This is the first entry, so position is 0
          }
        } : undefined,
      },
      include: {
        tasks: false,
        dueAfterTime: true,
        turnaroundTime: true,
        assignee: true,
        assignedBy: true,
        createdBy: true,
        assigneeHistory: {
          include: {
            user: true
          },
          orderBy: {
            position: 'asc'
          }
        },
      },
    });

    revalidatePath("/(components)/(contentlayout)/dashboard", "page");
    revalidatePath("/dashboard", 'page');

    return newRequest;
  } catch (error) {
    console.error('Error saving new request:', error);
    throw error;
  }
}


export async function deleteRequest(id) {
  try {
    // Use a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (prisma) => {
      // First, delete all AssigneeHistoryEntry records associated with this request
      await prisma.assigneeHistoryEntry.deleteMany({
        where: { requestId: id }
      });

      // Then delete the request and its associated tasks and logs
      const deletedRequest = await prisma.request.delete({
        where: { id },
        include: {
          tasks: true,
          changeLog: true
        }
      });

      return deletedRequest;
    });

    console.log(`Deleted request ${id} along with ${result.tasks.length} tasks, ${result.changeLog.length} log entries, and all associated AssigneeHistoryEntry records`);

    return result;
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
    
    revalidatePath(
      "/(components)/(contentlayout)/dashboard",
      "page"
    );
    revalidatePath(
      "/dashboard",
      'page'
    );

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

export async function processTextToRequest(text) {
  if (!text) {
    return { error: 'No text provided' };
  }

  try {
    const response = await fetch('https://poe.nimblefi.com/ask-bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify({
        question: text,
        bot: "deleg8"
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { response: data.Response };

  } catch (error) {
    console.error('Request failed:', error);
    return { error: 'Request failed', message: error.message };
  }
}

export async function findTasks(htmlContent = '', requestId = '') {

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const taskList = document.querySelector('ol');
  if (!taskList) {
    console.log('No ordered list found in the HTML content');
    return [];
  }

  const tasks = Array.from(taskList.children).map((li) => {
    const titleElement = li.querySelector('strong');
    const title = titleElement ? titleElement.textContent : '';
    
    // Remove the title from the text content
    let taskText = li.textContent || '';
    if (title) {
      taskText = taskText.replace(title, '').trim();
    }
    
    // Remove the bullet points and nested list items
    taskText = taskText.replace(/^[•\-]\s*/gm, '').trim();

    return { title, taskText, requestId };
  });

  return tasks;
}

export async function createAiTasksAction(html, requestId) {
const tasks = await findTasks(html, requestId);
createTasks(tasks);

} 

export async function createAiInstructions(htmlContent = '') {

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Extract project name
  const projectElement = Array.from(document.querySelectorAll('p strong')).find(el => 
    el.textContent?.trim() === 'Project:'
  );
  const project = projectElement ? projectElement.parentElement?.textContent?.replace('Project:', '').trim() : '';

  // Extract task overview
  const taskOverviewElement = Array.from(document.querySelectorAll('p strong')).find(el => 
    el.textContent?.trim() === 'Task Overview:'
  );
  let taskOverview = '';
  if (taskOverviewElement) {
    const taskOverviewParagraph = taskOverviewElement.parentElement?.nextElementSibling;
    taskOverview = taskOverviewParagraph ? taskOverviewParagraph.textContent || '' : '';
  }

  // Construct the instructions
  const instructions = `
${project && `<p><strong>Project:</strong></p>
  <p>${project}</p>`}
${taskOverview && `<p><strong>Task Overview:</strong></p>
<p>${taskOverview}</p>`}
  `.trim();



  return instructions;
}

export async function createAiNotes(htmlContent) {

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Find the ordered list
  const ol = document.querySelector('ol');

  if (!ol) {
    console.log('No ordered list found in the HTML content');
    return 'No Notes, no tasks'; // Return empty string if no ordered list is found
  }

  // Get all elements after the ordered list
  let currentElement = ol.nextElementSibling;
  let notesContent = '';

  while (currentElement) {
    notesContent += currentElement.outerHTML;
    currentElement = currentElement.nextElementSibling;
  }

  // If no content was found after the list, return an empty string
  if (!notesContent.trim()) {
    console.log('No content found after the ordered list');
    return 'No Notes';
  }

  return notesContent;
}

export async function createLog(
  requestId,
  action,
  details
) {

  try {
    const newLog = await prisma.log.create({
      data: {
        requestId,
        action,
        details,
      },
    });

    // Revalidate the path where logs are displayed
    // revalidatePath('/logs');

    return { success: true, log: newLog };
  } catch (error) {
    console.error('Error creating log:', error);
    return { success: false, error: 'Failed to create log' };
  }
}

export async function fetchLogs(page = 1, pageSize = 10) {

  try {
    const totalLogs = await prisma.log.count();
    const totalPages = Math.ceil(totalLogs / pageSize);

    const logs = await prisma.log.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        request: true,
      },
    });

    return {
      success: true,
      logs,
      pagination: {
        currentPage: page,
        totalPages,
        totalLogs,
      },
    };
  } catch (error) {
    console.error('Error fetching logs:', error);
    return { success: false, error: 'Failed to fetch logs' };
  }
}

export async function getLogsByRequestId(requestId) {

  try {
    const logs = await prisma.log.findMany({
      where: {
        requestId: requestId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        request: true,
      },
    });

    return { success: true, logs };
  } catch (error) {
    console.error('Error fetching logs by request ID:', error);
    return { success: false, error: 'Failed to fetch logs for the given request ID' };
  }
}

export async function removeAssigneeFromHistory(requestId, assigneeId) {
  try {
    // First, fetch the current request to check the current assignee
    const currentRequest = await prisma.request.findUnique({
      where: { id: requestId },
      select: { assigneeId: true }
    });

    // Check if the assignee to be removed is the current assignee
    if (currentRequest.assigneeId === assigneeId) {
      return { 
        success: false, 
        error: 'Cannot remove the current assignee from history' 
      };
    }

    // If not the current assignee, proceed with removal
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        assigneeHistory: {
          disconnect: { id: assigneeId }
        }
      },
      include: {
        assigneeHistory: true
      }
    });

    // Revalidate the paths where requests are displayed
    revalidatePath("/dashboard", "page");

    return { success: true, updatedRequest };
  } catch (error) {
    console.error('Error removing assignee from history:', error);
    return { success: false, error: 'Failed to remove assignee from history' };
  }
}