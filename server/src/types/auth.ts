export enum Role {
  USER = 'USER',
  LIBRARIAN = 'LIBRARIAN',
  ADMIN = 'ADMIN'
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface JwtPayload extends TokenPayload {
  iat?: number;
  exp?: number;
} 