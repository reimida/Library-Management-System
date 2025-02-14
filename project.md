# Library Seat Reservation System

## Overview
A system for managing seat reservations in libraries. It handles user authentication, library management, seat bookings, and scheduling.

## Core Modules

### Users
Manages library users and their authentication.

#### Core Features
- User registration and authentication
- Profile management (view, edit)
- Role-based access control (USER, LIBRARIAN, ADMIN)

#### Data Model
- name: string
- email: string (unique)
- password: string (hashed)
- role: enum (USER, LIBRARIAN, ADMIN)
- timestamps: createdAt, updatedAt

#### Access Control
- Public: Register, login
- Authenticated: View/edit own profile
- Admin: (future) User management

#### Relationships
- Can make multiple reservations
- Each reservation belongs to one user

#### Implementation Status: ✅ Complete
- ✅ User registration with validation
- ✅ Secure password hashing
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Profile management

### Libraries
Manages library locations and their properties.

#### Core Features
- Library information management:
  - Basic info (name, unique code)
  - Contact details (phone, email)
  - Address (street, city, state, postal code, country)
  - Capacity (total seats)
- Operating hours management (weekly schedule)
- Status tracking (active/inactive)

#### Data Model
- name: string (required, max 100 chars)
- libraryCode: string (required, unique, uppercase, max 10 chars)
- address: {
  - street: string (required)
  - city: string (required)
  - state: string (required)
  - postalCode: string (required)
  - country: string (required)
}
- operatingHours: {
  - monday: { open: "HH:mm", close: "HH:mm" } (required)
  - tuesday: { open: "HH:mm", close: "HH:mm" } (required)
  - wednesday: { open: "HH:mm", close: "HH:mm" } (required)
  - thursday: { open: "HH:mm", close: "HH:mm" } (required)
  - friday: { open: "HH:mm", close: "HH:mm" } (required)
  - saturday: { open: "HH:mm", close: "HH:mm" } (optional)
  - sunday: { open: "HH:mm", close: "HH:mm" } (optional)
}
- contactPhone: string (required, validated format)
- contactEmail: string (required, validated email)
- totalSeats: number (required, min 1)
- isActive: boolean (default true)
- timestamps: createdAt, updatedAt

#### Access Control
- Public: View libraries and their details
- Librarian: Create and update libraries
- Admin: All operations including deletion

#### Relationships
- Contains multiple seats (planned)
- Has one schedule (planned)
- Can have multiple reservations through seats (planned)

#### Implementation Status: ✅ Complete
- ✅ Basic CRUD operations
- ✅ Role-based access control
- ✅ Operating hours management
- ✅ Status tracking
- ✅ Input validation

### Seats
Manages individual seats within libraries.
- Seat properties (code, floor, area)
- Availability tracking
- Relationships:
  - Belongs to one library
  - Can have multiple reservations
  - Each reservation is for one seat

### Reservations
Manages booking of seats by users.
- Reservation creation and tracking
- Time-slot management
- Status tracking (active, cancelled, completed)
- Relationships:
  - Belongs to one user
  - Is for one specific seat
  - Indirectly associated with one library through seat

### Schedules
Manages library operating hours and exceptions.
- Regular operating hours
- Special hours and holiday management
- Relationships:
  - Belongs to one library
  - Affects seat availability
  - Influences reservation possibilities

## Implementation Priority & Dependencies

1. ✅ User Authentication & Management
   - Core user functionality
   - Role-based access control
   - Authentication middleware

2. ✅ Library Management
   - Basic library CRUD
   - Operating hours management
   - Status tracking

3. Schedule Management
   - Library operating hours
   - Exception handling (holidays)
   - Required before seats/reservations to validate operating hours

4. Seat Management
   - Seat CRUD operations
   - Availability tracking
   - Depends on:
     - Libraries (seats belong to libraries)
     - Schedules (for availability checks)

5. Reservation System
   - Reservation creation/management
   - Depends on:
     - Users (who makes the reservation)
     - Seats (what is being reserved)
     - Schedules (when reservation is valid)

## Tech Stack
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JWT
- Testing: Jest and Supertest
- Documentation: Swagger/OpenAPI
- Linting/Formatting: ESLint and Prettier