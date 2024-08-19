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
  initiativesTags = [],
  status = "Request"
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
      status,
    },
  });

  return request;
}

async function main() {
  // await createUser("jsmith", "jsmith@example.com", "yourpassword", "John", "Smith", "ADMIN");
  await createUser("dbrottlund2", "dere2@usefilepton.com", "1234", "Derek", "Brottlund", "ADMIN");
  // // Create a user (Assuming we have a user with id 1 already, so skipping createUser)
  // const user = await prisma.user.findFirst({ where: { username: "jsmith" } });

  // Create TimeFrames
  // const dueAfterTime = await createTimeFrame("DAY", 2);
  // const turnaroundTime = await createTimeFrame("HOUR", 8);

  // Create a request with all fields
  // Create a request with all fields
// const request = await createRequest(
//   "Train new recruit on warp field theory and practical applications",
//   user.id,  // Created by the user we just found
//   dueAfterTime.id,
//   turnaroundTime.id,
//   user.id,  // Assign the same user as the assignee for demonstration
//   user.id,  // Assign the same user as the assigner for demonstration
//   "Before delving into warp field theory and its practical applications, it's crucial to establish a solid foundation in subspace physics and the principles of faster-than-light travel. Warp technology is the cornerstone of interstellar exploration and commerce, enabling starships to traverse vast distances in relatively short periods. This training will provide the recruit with a comprehensive understanding of warp field mechanics, the role of the warp core in generating and maintaining warp fields, and the practical considerations for safe and efficient warp travel.",
//   "Mastering warp field theory and its applications requires a blend of theoretical knowledge and practical skills. By completing these tasks, the recruit will gain a deep understanding of warp technology and its implementation in starship operations. Continuous study and hands-on experience with warp field simulations will be essential for developing expertise in this field. Remember, the ability to safely and efficiently utilize warp technology is crucial for the success of Starfleet missions and the exploration of new frontiers in space.",
//   "",  // Original request text (empty as provided)
//   "",  // AI processed request text (empty as provided)
//   new Date("2024-08-05T10:30:00Z"),  // completedAt timestamp
//   100,  // percentComplete
//   new Date("2024-08-09T14:30:00Z"),  // startedAt timestamp
//   ["Explain basic principles of warp field theory"],  // Completed tasks
//   ["ONBOARDING", "COMPLIANCE"],  // productTags
//   ["CYBERSECURITY", "API"]  // initiativesTags
// );

// Create tasks associated with the request
// const tasks = [
//   {
//     title: "Explain basic principles of warp field theory",
//     text: "Provide an overview of warp field theory, including the concept of subspace, the role of dilithium crystals, and the basic equations governing warp field dynamics.",
//   },
//   {
//     title: "Demonstrate warp field simulation",
//     text: "Use the holodeck to run a warp field simulation, showing how different energy inputs and field configurations affect warp bubble formation and stability.",
//   },
//   {
//     title: "Review warp core operations and safety protocols",
//     text: "Explain the function of each major component in the warp core, the matter/antimatter reaction process, and critical safety measures to prevent warp core breaches.",
//   },
//   {
//     title: "Analyze warp field efficiency and optimization techniques",
//     text: "Discuss methods for optimizing warp field geometry to improve efficiency and reduce subspace distortions. Include practical exercises in warp field tuning using simulated scenarios.",
//   },
// ];

// for (const taskData of tasks) {
//   await createTask(taskData.title, taskData.text, request.id);
// }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
