import { hash } from "bcrypt";
import { prisma } from "../config/database";
import { User } from "../models/User";

export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt" | "role">) {
  const hashedPassword = await hash(userData.password, 10);
  
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
} 