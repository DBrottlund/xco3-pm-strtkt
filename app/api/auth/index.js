import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export const BASE_PATH = "/api/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          if (!user) {
            console.log(`Login attempt failed: User ${credentials.username} not found`);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log(`Login attempt failed: Invalid password for user ${credentials.username}`);
            return null;
          }

          console.log(`Successful login for user ${credentials.username} at ${new Date().toISOString()}`);
          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Database error during login:", error);
          return null;
        }
      },
    }),
  ],
  basePath: BASE_PATH,
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth } = NextAuth(authOptions);

export async function signIn(credentials) {
  try {
    const result = await auth.signIn("credentials", {
      redirect: false,
      username: credentials.username,
      password: credentials.password,
    });

    if (result.error) {
      console.error(`Login failed for user ${credentials.username}: ${result.error}`);
      return { error: result.error };
    }

    console.log(`Successful login for user ${credentials.username} at ${new Date().toISOString()}`);
    return { success: true };
  } catch (error) {
    console.error(`Unexpected error during login for user ${credentials.username}:`, error);
    return { error: "An unexpected error occurred" };
  }
}

export const signOut = auth.signOut;