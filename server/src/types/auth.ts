export enum Role {
  USER = 'user',
  LIBRARIAN = 'librarian',
  ADMIN = 'admin'
}

// Define permissions per role for clarity
export const RolePermissions = {
  [Role.USER]: [
    'view_libraries',
    'book_seats',
    'view_own_bookings'
  ],
  
  [Role.LIBRARIAN]: [
    'view_libraries',
    'manage_own_library', // Can only manage their assigned library
    'manage_seats',
    'view_bookings',
    'manage_bookings'
  ],
  
  [Role.ADMIN]: [
    'view_libraries',
    'manage_all_libraries', // Can manage ANY library
    'manage_librarians',
    'manage_users',
    'view_analytics',
    'system_settings'
  ]
} as const;

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface JwtPayload extends TokenPayload {
  iat?: number;
  exp?: number;
} 