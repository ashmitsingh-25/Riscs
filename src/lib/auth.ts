import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "analyst@trustnet.ai" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        try {
          // Attempt to find existing user in database
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            // Default demo sandbox login
            if (email === "analyst@trustnet.ai" && password === "trustnet2026") {
              return {
                id: "demo-analyst-1",
                email: "analyst@trustnet.ai",
                name: "Lead Security Analyst",
                role: "ANALYST",
              };
            }
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          // Graceful fallback for local development without active DB
          if (email === "analyst@trustnet.ai" && password === "trustnet2026") {
            return {
              id: "demo-analyst-1",
              email: "analyst@trustnet.ai",
              name: "Lead Security Analyst",
              role: "ANALYST",
            };
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET || "f6c8d7e9b0a1c2d3e4f5061728394a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
});
