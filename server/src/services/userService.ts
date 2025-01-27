import { UserModel } from "../models/User";
import { createUserInDB, findUserByEmail } from "../repositories/userRepository";
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwtUtils';
import type { LoginInput, RegisterInput } from '../validations/authSchemas';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in env

// Rename to match controller's expected function name
export async function registerUser(userData: RegisterInput){
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const userWithHashedPassword = {
    ...userData,
    password: hashedPassword,
  };

  const createdUser = await createUserInDB(userWithHashedPassword);

  // Return user without password
  const { password: _, ...userWithoutPassword } = createdUser
  return userWithoutPassword;
}

type LoginResponse = {
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
};

export async function loginUser(credentials: LoginInput): Promise<LoginResponse> {
  const user = await findUserByEmail(credentials.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(
    credentials.password,
    user.password
  );
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  const { password: _, ...userWithoutPassword } = user.toObject();
  return { 
    user: userWithoutPassword, 
    token 
  } as LoginResponse;
} 