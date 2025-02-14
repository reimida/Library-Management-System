# API Specification

## Authentication
All endpoints except registration and login require JWT authentication.

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

## Libraries API (✅ Implemented)

### Public Endpoints
- GET /libraries
  - List all active libraries
  - Query params: 
    - includeInactive: boolean (default: false)
  - Returns: Array of libraries with their details

- GET /libraries/:libraryId
  - Get library details
  - Returns: Full library details including:
    - Basic information
    - Address
    - Operating hours
    - Contact details
    - Current status
    - Virtual field: isOpen (based on current time)

### Admin/Librarian Only
- POST /libraries
  - Create new library
  - Auth: Bearer token (ADMIN or LIBRARIAN)
  - Body: 
    - name: string (required, max 100)
    - libraryCode: string (required, unique, max 10)
    - address: {
      street: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    - operatingHours: {
      monday: { open: "HH:mm", close: "HH:mm" }
      tuesday: { open: "HH:mm", close: "HH:mm" }
      wednesday: { open: "HH:mm", close: "HH:mm" }
      thursday: { open: "HH:mm", close: "HH:mm" }
      friday: { open: "HH:mm", close: "HH:mm" }
      saturday?: { open: "HH:mm", close: "HH:mm" }
      sunday?: { open: "HH:mm", close: "HH:mm" }
    }
    - contactPhone: string
    - contactEmail: string
    - totalSeats: number
    - isActive: boolean (optional)
  - Returns: Created library object

- PUT /libraries/:libraryId
  - Update library
  - Auth: Bearer token (ADMIN or LIBRARIAN)
  - Body: Same as POST (all fields optional)
  - Returns: Updated library object

- DELETE /libraries/:libraryId
  - Delete library
  - Auth: Bearer token (ADMIN only)
  - Returns: Success message

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

## Seats API (Depends on Schedules)

### Public Endpoints
- GET /seats
  - List all seats
  - Query params: libraryId, status, floor, area
  - Note: Availability considers schedule

- GET /seats/:seatId
  - Get seat details
  - Returns: includes current availability based on schedule

### Admin/Librarian Only
- POST /libraries/:libraryId/seats
  - Create new seat in library
  - Body: code, floor, area
  - Note: Requires valid library

- PUT /seats/:seatId
  - Update seat
  - Body: code, floor, area, status
  - Note: Status changes affect reservations

- DELETE /seats/:seatId
  - Delete seat
  - Note: Only if no active reservations

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