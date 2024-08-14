const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createUser(username, email, plainPassword, firstName, lastName, role) {
  const hashedPassword = bcrypt.hashSync(plainPassword, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    },
  });

  return user;
}

async function createTimeFrame(timeUnit, timeNumber) {
  const timeFrame = await prisma.timeFrame.create({
    data: {
      timeUnit,
      timeNumber,
    },
  });

  return timeFrame;
}

async function createTask(title, taskText, requestId) {
  const task = await prisma.task.create({
    data: {
      title,
      taskText,
      requestId,
    },
  });

  return task;
}

async function createRequest(
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

async function main() {
  // Create a user (Assuming we have a user with id 1 already, so skipping createUser)
  const user = await prisma.user.findFirst({ where: { id: "64fd5312-b6e7-45f7-ad8f-32250db06279" } });

  // Create TimeFrames
  const dueAfterTime = await createTimeFrame("DAY", 2);
  const turnaroundTime = await createTimeFrame("HOUR", 8);

  // Create a request with all fields
  const request = await createRequest(
    "Train new recruit on dilithium recrystallization procedure",
    user.id,  // Created by the user we just found
    dueAfterTime.id,
    turnaroundTime.id,
    user.id,  // Assign the same user as the assignee for demonstration
    user.id,  // Assign the same user as the assigner for demonstration
    "Before starting the dilithium recrystallization procedure, it's essential to understand the importance of each step and the safety protocols involved. Dilithium crystals are a critical component in the operation of the warp core, and proper handling and recrystallization are vital for maintaining the stability and efficiency of the starship's propulsion system. This training will provide the recruit with a comprehensive understanding of the procedures, safety measures, and hands-on experience needed to perform recrystallization effectively and safely.",
    "Completing the dilithium recrystallization procedure requires precision, attention to detail, and adherence to safety protocols. By following these steps, the recruit will gain the necessary skills and confidence to handle and recrystallize dilithium crystals effectively. Regular practice and continuous learning are encouraged to maintain proficiency in these critical operations. Remember, the safety and efficiency of the warp core depend on the proper execution of these procedures. Stay vigilant and always prioritize safety.",
    "",  // Original request text (empty as provided)
    "",  // AI processed request text (empty as provided)
    new Date("2024-08-05T10:30:00Z"),  // completedAt timestamp
    100,  // percentComplete
    new Date("2024-08-09T14:30:00Z"),  // startedAt timestamp
    ["Explain warpcore magnetic containment"],  // Completed tasks
    ["ONBOARDING", "COMPLIANCE"],  // productTags
    ["CYBERSECURITY", "API"]  // initiativesTags
  );

  // Create tasks associated with the request
  const tasks = [
    {
      title: "Explain warpcore magnetic containment",
      text: "Provide a detailed explanation of the magnetic containment system used in the warpcore to stabilize the antimatter and matter reactions. Include diagrams and safety protocols.",
    },
    {
      title: "Demonstrate dilithium crystal handling",
      text: "Show the proper techniques for handling dilithium crystals, including how to safely install and remove them from the warp core. Emphasize the importance of protective gear.",
    },
    {
      title: "Review dilithium recrystallization process",
      text: "Walk through the step-by-step procedure for recrystallizing dilithium. Cover the necessary equipment, conditions required, and potential hazards to watch out for.",
    },
    {
      title: "Conduct practical exercise on recrystallization",
      text: "Have the recruit perform a supervised recrystallization of a dilithium crystal. Provide guidance and feedback to ensure proper technique and safety are maintained throughout the process.",
    },
  ];

  for (const taskData of tasks) {
    await createTask(taskData.title, taskData.text, request.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
