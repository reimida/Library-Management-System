# Library Seat Reservation System - Project Tasks

## Overview

A system for managing seat reservations in libraries. It handles user authentication, library management, seat bookings, and scheduling.

## Core Modules

### 1. Users

Manages library users and their authentication.

#### Core Features

-   [X] User registration and authentication
-   [X] Profile management (view, edit)
-   [X] Role-based access control:
    -   [X] USER: Basic library access and bookings
    -   [X] LIBRARIAN: Manage assigned library and its resources
    -   [X] ADMIN: Full system access and librarian management

#### Data Model

-   [X] name: string
-   [X] email: string (unique)
-   [X] password: string (hashed)
-   [X] role: enum (USER, LIBRARIAN, ADMIN)
-   [X] timestamps: createdAt, updatedAt

#### API Endpoints

##### Public Endpoints
-   [X] POST /users/register - Register new user
-   [X] POST /users/login - User login

##### Protected Endpoints
-   [X] GET /users/profile - Get authenticated user's profile
-   [X] PATCH /users/profile - Update user profile

##### Admin Only Endpoints
-   [X] POST /users/:userId/librarian - Assign librarian role to user
-   [X] DELETE /users/:userId/librarian - Remove librarian role from user

#### Relationships

-   [ ] Can make multiple reservations (Not implemented yet)
-   [ ] Each reservation belongs to one user (Not implemented yet)
-   [X] Librarians are linked to specific libraries

#### Implementation Status: ✅ Complete (Except Reservations)

-   [X] User registration with validation
-   [X] Secure password hashing
-   [X] JWT authentication
-   [X] Role-based authorization
-   [X] Profile management
-   [X] Librarian role management
-   [X] Input Validations
-   [X] Repositories and Services follow SRP

### 2. Libraries

Manages library locations and their properties.

#### Core Features

-   [X] Library information management:
    -   [X] Basic info (name, unique code)
    -   [X] Contact details (phone, email)
    -   [X] Address (street, city, state, postal code, country)
    -   [X] Capacity (total seats)
-   [X] Operating hours management (weekly schedule)
-   [X] Status tracking (active/inactive)

#### Data Model

-   [X] name: string (required, max 100 chars)
-   [X] libraryCode: string (required, unique, uppercase, max 10 chars)
-   [X] address: {
    -   [X] street: string (required)
    -   [X] city: string (required)
    -   [X] state: string (required)
    -   [X] postalCode: string (required)
    -   [X] country: string (required)
    }
-   [X] operatingHours: {
    -   [X] monday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] tuesday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] wednesday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] thursday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] friday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] saturday?: { open: "HH:mm", close: "HH:mm" }
    -   [X] sunday?: { open: "HH:mm", close: "HH:mm" }
    }
-   [X] contactPhone: string (required, validated format)
-   [X] contactEmail: string (required, validated email)
-   [X] totalSeats: number (required, min 1)
-   [X] isActive: boolean (default true)
-   [X] timestamps: createdAt, updatedAt

#### API Endpoints

##### Public Endpoints
-   [X] GET /libraries - List all active libraries
-   [X] GET /libraries/:libraryId - Get library details

##### Protected Endpoints
-   [X] PATCH /libraries/:libraryId - Update library details (ADMIN or assigned LIBRARIAN)

##### Admin Only Endpoints
-   [X] POST /libraries - Create new library
-   [X] DELETE /libraries/:libraryId - Delete library

#### Relationships

-   [X] Contains multiple seats
-   [X] Has one schedule
-   [ ] Can have multiple reservations through seats (Planned, dependent on Reservations)
-   [X] Can have multiple assigned librarians

#### Implementation Status: ✅ Complete (Except Reservations)

-   [X] Basic CRUD operations
-   [X] Role-based access control
-   [X] Operating hours management
-   [X] Status tracking
-   [X] Input validation
-   [X] Librarian assignment and management
-   [X] Library code uniqueness validation
-   [X] Repositories and Services follow SRP

### 3. Seats

Manages individual seats within libraries.

#### Core Features

-   [X] Seat properties (code, floor, area)
-   [ ] Availability tracking (Partially implemented - `status` field exists, but full reservation logic is missing)

#### Data Model
-   [X] code: string (unique within library)
-   [X] floor: string
-   [X] area: string
-   [X] status: 'AVAILABLE' | 'RESERVED' | 'OUT_OF_SERVICE'
-   [X] libraryId: (references Library)
-   [X] timestamps: createdAt, updatedAt

#### API Endpoints

##### Public Endpoints
-   [X] GET /libraries/:libraryId/seats - List all seats in a library
-   [X] GET /libraries/:libraryId/seats/:seatId - Get seat details

##### Admin/Librarian Only Endpoints
-   [X] POST /libraries/:libraryId/seats - Create new seat in library
-   [X] PUT /libraries/:libraryId/seats/:seatId - Update seat details
-   [X] DELETE /libraries/:libraryId/seats/:seatId - Delete seat

#### Relationships

-   [X] Belongs to one library
-   [ ] Can have multiple reservations (Not implemented yet)
-   [ ] Each reservation is for one seat (Not Implemented yet)

#### Implementation Status: ✅ Complete (Except Reservations)

-   [X] Basic CRUD operations
-   [X] Seat properties implemented and validated
-   [X] Unique seat code within library
-   [X] Relationships with Library Implemented
-   [X] Controllers, Services and Repositories
-   [X] Input Validation

### 4. Schedules

Manages library operating hours.

#### Core Features

-   [X] Regular operating hours management

#### Data Model

-   [X] libraryId: (references Library)
-   [X] schedule: {
    -   [X] monday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] tuesday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] wednesday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] thursday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] friday: { open: "HH:mm", close: "HH:mm" } (required)
    -   [X] saturday?: { open: "HH:mm", close: "HH:mm" }
    -   [X] sunday?: { open: "HH:mm", close: "HH:mm" }
   }
-   [X] timestamps: createdAt, updatedAt

#### API Endpoints

##### Public Endpoints
-   [X] GET /libraries/:libraryId/schedule - Get library's regular weekly schedule

##### Admin/Librarian Only Endpoints
-   [X] PUT /libraries/:libraryId/schedule - Update library's regular weekly schedule
-   [X] POST /libraries/:libraryId/schedule - Create library's regular weekly schedule
-   [X] DELETE /libraries/:libraryId/schedule - Delete library's regular weekly schedule

#### Relationships

-   [X] Belongs to one library
-   [ ] Affects seat availability
-   [ ] Influences reservation possibilities

#### Implementation Status: ✅ Complete

-   [X] Schedule Model
-   [X] Controllers
-   [X] Services
-   [X] Repositories
-   [X] Routes
-   [X] Input Validations

### 5. Reservations

Manages booking of seats by users. **NOT IMPLEMENTED**

#### Core Features

-   [ ] Reservation creation and tracking
-   [ ] Time-slot management
-   [ ] Status tracking (active, cancelled, completed)

#### Data Model (Planned)

-   userId: (references User)
-   seatId: (references Seat)
-   startTime: Date
-   endTime: Date
-   status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED'
-   timestamps: createdAt, updatedAt

#### API Endpoints

##### User Endpoints
-   [ ] GET /users/me/reservations - List user's reservations
-   [ ] POST /users/me/reservations - Create reservation
-   [ ] DELETE /users/me/reservations/:id - Cancel reservation

##### Admin/Librarian Only Endpoints
-   [ ] GET /libraries/:libraryId/reservations - List all reservations for a library
-   [ ] GET /seats/:seatId/reservations - List all reservations for a seat

#### Relationships

-   [ ] Belongs to one user
-   [ ] Is for one specific seat
-   [ ] Indirectly associated with one library through seat

#### Implementation Status: ❌ Not Started

-   [ ] Reservation Model
-   [ ] Controllers
-   [ ] Services
-   [ ] Repositories
-   [ ] Routes
-   [ ] Input Validations
-   [ ] Business Validations (Seat availability, Library schedule, Operating hours)

## Tech Stack

-   [X] Backend: Node.js with Express.js
-   [X] Database: MongoDB
-   [X] Authentication: JWT
-   [X] Testing: Jest and Supertest
-   [ ] Documentation: Swagger/OpenAPI (Not implemented yet)
-   [X] Linting/Formatting: ESLint and Prettier (Assumed based on common practice, but not explicitly in the codebase)

## Overall Implementation Priority & Dependencies

1.  ✅ User Authentication & Management
2.  ✅ Library Management
3.  ✅ Schedule Management
4.  ✅ Seat Management
5.  ❌ Reservation System
