// prisma/seed.js

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

async function main() {
  await createUser("jsmith", "jsmith@example.com", "yourpassword", "John", "Smith", "ADMIN");
  await createUser("dbrottlund", "derek@usefilepton.com", "1234", "Derek", "Brottlund", "PM");
  // Add more users as needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
