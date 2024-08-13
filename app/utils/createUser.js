import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(username, email, plainPassword, firstName, lastName, role) {
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
