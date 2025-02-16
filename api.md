# API Specification

## Authentication
All endpoints except registration and login require JWT authentication.

## Role-Based Authorization
The system has three roles with different permissions:
- USER: Can view libraries and manage their own bookings
- LIBRARIAN: Can manage their assigned library and its seats/bookings
- ADMIN: Has full system access including librarian management

## Users API (✅ Implemented)

### Public Endpoints
- POST /users/register
  - Register new user
  - Body: 
    - name: string (min 3 chars)
    - email: string (valid email)
    - password: string (min 6 chars)
  - Returns: 
    - user: { email, name }
    - message: "User registered successfully"

- POST /users/login
  - User login
  - Body: 
    - email: string
    - password: string
  - Returns: 
    - token: JWT
    - user: { email, name, role }
    - message: "Login successful"

### Protected Endpoints
- GET /users/profile
  - Get authenticated user's profile
  - Auth: Bearer token
  - Returns: User profile (excluding password)

- PATCH /users/profile
  - Update user profile
  - Auth: Bearer token
  - Body: 
    - name: string (optional)
    - email: string (optional)
  - Returns:
    - user: Updated profile
    - message: "Profile updated successfully"

### Admin Only Endpoints
- POST /users/:userId/librarian
  - Assign librarian role to user and link to library
  - Auth: Bearer token (ADMIN only)
  - Body:
    - libraryId: string (required)
  - Returns:
    - user: Updated user object with librarian role
    - message: "User assigned as librarian successfully"

- DELETE /users/:userId/librarian
  - Remove librarian role from user and unlink from library
  - Auth: Bearer token (ADMIN only)
  - Body:
    - libraryId: string (required)
  - Returns:
    - user: Updated user object with user role
    - message: "Librarian role removed successfully"

## Libraries API

### Public Endpoints
- GET /libraries
  - List all active libraries
  - Query params: 
    - includeInactive: boolean (default: false)
  - Returns: Array of libraries with their details

- GET /libraries/:libraryId
  - Get library details
  - Returns: {
    id: string
    name: string
    libraryCode: string
    address: {
      street: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    operatingHours: {
      monday: { open: string, close: string }
      tuesday: { open: string, close: string }
      wednesday: { open: string, close: string }
      thursday: { open: string, close: string }
      friday: { open: string, close: string }
      saturday?: { open: string, close: string }
      sunday?: { open: string, close: string }
    }
    contactPhone: string
    contactEmail: string
    totalSeats: number
    isActive: boolean
    librarians: string[] // Array of librarian user IDs
    isOpen: boolean // Virtual field based on current time
    createdAt: string
    updatedAt: string
  }

### Protected Endpoints
- PATCH /libraries/:libraryId
  - Update library details
  - Auth: Bearer token (ADMIN or assigned LIBRARIAN)
  - Note: Librarians can only update libraries they are assigned to
  - Body: Same fields as POST (all optional)
  - Returns: Updated library object

### Admin Only Endpoints
- POST /libraries
  - Create new library
  - Auth: Bearer token (ADMIN only)
  - Body: 
    - name: string (required, max 100)
    - libraryCode: string (required, unique, max 10, uppercase)
    - address: {
      street: string (required)
      city: string (required)
      state: string (required)
      postalCode: string (required)
      country: string (required)
    }
    - operatingHours: {
      monday: { open: "HH:mm", close: "HH:mm" } (required)
      tuesday: { open: "HH:mm", close: "HH:mm" } (required)
      wednesday: { open: "HH:mm", close: "HH:mm" } (required)
      thursday: { open: "HH:mm", close: "HH:mm" } (required)
      friday: { open: "HH:mm", close: "HH:mm" } (required)
      saturday?: { open: "HH:mm", close: "HH:mm" }
      sunday?: { open: "HH:mm", close: "HH:mm" }
    }
    - contactPhone: string (required, format: +?[0-9\s-]+)
    - contactEmail: string (required, valid email)
    - totalSeats: number (required, min: 1)
    - isActive: boolean (optional, default: true)
  - Returns: Created library object

- DELETE /libraries/:libraryId
  - Delete library
  - Auth: Bearer token (ADMIN only)
  - Returns: { message: "Library deleted successfully" }
  - Errors:
    - 400: Invalid library ID format
    - 403: Not authorized
    - 404: Library not found

## Schedules API (Next to Implement)

### Public Endpoints
- GET /libraries/:libraryId/schedule
  - Get library schedule
  - Returns: operating hours and exceptions

### Admin/Librarian Only
- PUT /libraries/:libraryId/schedule
  - Update library schedule
  - Body: operatingHours, exceptions
  - Required for: seat availability and reservation validation

## Seats API

### Public Endpoints
- GET /libraries/:libraryId/seats
  - List all seats in a library
  - Query params: 
    - floor: string
    - area: string
  - Returns: Array<{
    id: string
    code: string
    floor: string
    area: string
  }>

- GET /libraries/:libraryId/seats/:seatId
  - Get seat details
  - Returns: {
    id: string
    code: string
    floor: string
    area: string
    status: 'AVAILABLE' | 'RESERVED' | 'OUT_OF_SERVICE'
    libraryId: string
    createdAt: string
    updatedAt: string
  }

### Admin/Librarian Only Endpoints
- POST /libraries/:libraryId/seats
  - Create new seat in library
  - Auth: Bearer token (ADMIN or assigned LIBRARIAN)
  - Body: 
    - code: string (required, unique within library)
    - floor: string (required)
    - area: string (required)
  - Returns: Created seat object
  - Errors:
    - 400: Invalid input
    - 409: Seat code already exists
    - 403: Not authorized for this library

- PUT /libraries/:libraryId/seats/:seatId
  - Update seat details
  - Auth: Bearer token (ADMIN or assigned LIBRARIAN)
  - Body: 
    - code: string (optional)
    - floor: string (optional)
    - area: string (optional)
    - status: 'AVAILABLE' | 'RESERVED' | 'OUT_OF_SERVICE' (optional)
  - Returns: Updated seat object
  - Errors:
    - 400: Invalid input
    - 409: Seat code already exists
    - 403: Not authorized for this library
    - 404: Seat not found

- DELETE /libraries/:libraryId/seats/:seatId
  - Delete seat
  - Auth: Bearer token (ADMIN or assigned LIBRARIAN)
  - Returns: { message: "Seat deleted successfully" }
  - Errors:
    - 403: Not authorized for this library
    - 404: Seat not found
    - 400: Seat has active reservations

## Reservations API (Final Module)

### User Endpoints
- GET /reservations/me
  - List user's reservations
  - Query params: status, date
  - Note: Filtered by authenticated user

- POST /seats/:seatId/reservations
  - Create reservation
  - Body: startTime, endTime
  - Validation:
    - Seat availability
    - Library schedule
    - Operating hours

- DELETE /reservations/:reservationId
  - Cancel reservation
  - Note: Only for future reservations

### Admin/Librarian Only
- GET /reservations
  - List all reservations
  - Query params: userId, seatId, libraryId, status, date
  - Note: Full filtering capabilities 