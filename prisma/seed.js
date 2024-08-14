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

  await createUser("dbrottlund2", "derek2@usefilepton.com", "1234", "Derek2", "Brottlund2", "ADMIN");
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
