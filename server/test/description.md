# Test Documentation

## Setup (setup.ts)
Database connection management for testing environment.

### Operations
- `connect()`: Establishes MongoDB connection
- `clearDatabase()`: Cleans all collections
- `closeDatabase()`: Drops database and closes connection

## Authentication Module (12 tests)

### User Registration (register.test.ts - 3 tests)

#### POST /auth/register
1. Creates new user account (201)
   - Validates user record creation
   - Verifies password hashing
   - Checks response excludes sensitive data
2. Prevents duplicate email registration (409)
3. Validates required fields (400)

### User Login (login.test.ts - 4 tests)

#### POST /auth/login
1. Authenticates valid credentials (200)
   - Returns valid JWT token
   - Includes user data
2. Rejects invalid password (401)
3. Rejects non-existent user (404)
4. Validates required fields (400)

### Profile Management

#### GET /users/profile (getProfile.test.ts - 2 tests)
1. Retrieves authenticated user profile (200)
   - Returns user data
   - Excludes password
   - Matches registered data
2. Rejects unauthenticated access (401)

#### PATCH /users/profile (updateProfile.test.ts - 3 tests)
1. Updates user profile (200)
   - Persists changes
   - Returns updated data
2. Validates update data (400)
3. Rejects unauthenticated access (401)

## Library Module (21 tests)

### Core Library Operations (library.test.ts - 8 tests)

#### POST /libraries
1. Admin creates library (201)
2. Blocks librarian creation (403)
3. Blocks user creation (403)
4. Validates required fields (400)

#### GET /libraries
1. Lists libraries without auth (200)
2. Filters inactive libraries

#### PATCH /libraries/:id
1. Admin updates library (200)
2. Blocks unauthorized update (403)

### Library Service (libraryService.test.ts - 8 tests)

#### Library Management
1. Creates library successfully
2. Handles duplicate code conflict
3. Retrieves library by ID
4. Handles non-existent library
5. Updates library data
6. Handles update conflicts
7. Deletes library
8. Lists libraries with filters

### Librarian Management (librarianManagement.test.ts - 5 tests)

#### POST /users/:userId/librarian
1. Assigns librarian role (200)
2. Prevents duplicate assignment (409)
3. Handles non-existent library (404)
4. Blocks non-admin assignment (403)

#### DELETE /users/:userId/librarian
1. Removes librarian role (200)

## Seat Management (seats.test.ts - 10 tests)

#### POST /libraries/:libraryId/seats
1. Admin creates seat (201)
2. Librarian creates in assigned library (201)
3. Blocks unassigned library access (403)
4. Validates required fields (400)
5. Prevents duplicate codes (409)

#### GET /libraries/:libraryId/seats
1. Lists all seats (200)
2. Filters by status
3. Filters by floor

#### PATCH /libraries/:libraryId/seats/:seatId
1. Updates seat properties (200)
2. Validates update fields (400)

## Library Access (libraryAccess.test.ts - 8 tests)

### Access Control

#### PATCH /libraries/:libraryId
1. Librarian updates assigned library (200)
2. Blocks update on unassigned library (403)
3. Admin updates any library (200)
4. Maintains librarian assignments

#### GET /libraries/:libraryId/access
1. Validates access tokens
2. Handles expired tokens
3. Checks role-based permissions
4. Verifies audit trail

Total Test Count: 51 tests