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
        startedAt: data.startedAt || DateTime.now().setZone('America/Chicago'),
        completedTasks: data.completedTasks || [],
        assignee: { connect: { id: data.assigneeId } },
        assignedBy: { connect: { id: data.assignedById } },
        createdBy: { connect: { id: data.createdById } },
        percentComplete: data.percentComplete || 0,
        assigneeType: data.assigneeType || "USER",
        productTags: data.productTags || [],
        // initiativesTags: data.initiativesTags,
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
        // tasks: {
        //   create: data.tasks.map(task => ({
        //     title: task.title,
        //     taskText: task.taskText,
        //   })),
        // },
      },
      include: {
        tasks: false,
        dueAfterTime: true,
        turnaroundTime: true,
        assignee: true,
        assignedBy: true,
        createdBy: true,
      },
    });

    revalidatePath(
      "/(components)/(contentlayout)/dashboard",
      "page"
    );
    revalidatePath(
      "/dashboard",
      'page'
    );

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