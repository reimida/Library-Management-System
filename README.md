# Library Seats Booking System

## Project Overview

A comprehensive RESTful API backend built with Node.js and TypeScript for managing seat reservations in libraries. This system enables users to book study seats and allows library administrators to efficiently manage seat availability and reservations.

## Features

### User Management
- User registration and authentication with JWT
- Role-based access control (USER, LIBRARIAN, ADMIN)
- Profile management
- Secure password hashing

### Library Management
- Create, read, update, and delete library information
- Track library details (name, code, address, contact info)
- Manage library capacity
- Assign librarians to specific libraries

### Schedule Management
- Define and manage library operating hours
- Weekly schedule configuration
- Support for different hours on different days

### Seat Management
- Track individual seats within libraries
- Manage seat properties (code, floor, area)
- Monitor seat availability status
- Bulk seat creation and management

### Reservation System
- Book seats for specific time slots
- View, manage, and cancel reservations
- Automatic validation against library operating hours
- Prevent double-booking of seats

## Tech Stack

- **Backend Framework:** Node.js with Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod for schema validation
- **Testing:** Jest and Supertest
- **Documentation:** Swagger/OpenAPI
- **Linting and Formatting:** ESLint and Prettier

## Architecture

The project follows a clean architecture approach with clear separation of concerns:

- **Controllers:** Handle HTTP requests and responses
- **Services:** Implement business logic
- **Repositories:** Manage data access and database operations
- **Models:** Define data structures and schemas
- **Validations:** Ensure data integrity
- **Middlewares:** Handle cross-cutting concerns like authentication
- **Routes:** Define API endpoints
- **Utils:** Provide helper functions

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for testing environment)

### Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
   cd library-seats-booking
    ```

2. Install dependencies:
    ```bash
   cd server
    npm install
    ```

### Configuration

1. **Environment Variables:**
   - Create a `.env` file in the `server/` directory.
   - Add your MongoDB connection string and JWT secret. Example:
        ```env
        DATABASE_URL=mongodb://localhost:27017/library_seats
     JWT_SECRET=your_jwt_secret_key
        PORT=3000 # Optional: to run on a different port
        ```

2. **Database:**
   - Ensure MongoDB is installed and running. You can start it locally using:
        ```bash
        mongod
        ```
        (Make sure MongoDB `bin` directory is in your system's `PATH`)

        OR

     ```bash
        sudo systemctl start mongod
     ```

### Running the Backend

1. **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the server using `ts-node-dev` for automatic restarting on code changes. The server will be accessible at `http://localhost:3000` (or the port specified in your `.env` file).

2. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Documentation

The API is fully documented using Swagger/OpenAPI. Once the server is running, you can access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

This provides a comprehensive interface to:
- Explore all available endpoints
- View request/response schemas
- Test API calls directly from the browser
- Understand authentication requirements

You can also access the raw Swagger JSON specification at:

```
http://localhost:3000/swagger.json
```

### API Endpoints

Below are screenshots of the Swagger UI documentation for the API:

![Auth-and-Users](/server/images/auth-and-users.png)


![Libraries](/server/images/libraries.png)

![Seats](/server/images/seats.png)

![Reservations](/server/images/reservations.png)

![Schedules](/server/images/schedules.png)


## Example API Usage

### Register a New User

**Request:**
```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{
"name": "John Doe",
"email": "john.doe@example.com",
"password": "securePassword123"
}' \
http://localhost:3000/users/register
```

**Response (201 Created):**
```json
{
"message": "User registered successfully",
"user": {
"email": "john.doe@example.com",
"name": "John Doe"
}
}
```

### Login

**Request:**
```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}' \
http://localhost:3000/users/login
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "USER"
  }
}
```

### Create a Reservation

**Request:**
```bash
curl -X POST \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-d '{
  "seatId": "60d21b4667d0d8992e610c85",
  "startTime": "2023-06-15T10:00:00.000Z",
  "endTime": "2023-06-15T12:00:00.000Z"
}' \
http://localhost:3000/users/me/reservations
```

**Response (201 Created):**
```json
{
  "message": "Reservation created successfully",
  "reservation": {
    "id": "60d21b4667d0d8992e610c85",
    "seatId": "60d21b4667d0d8992e610c85",
    "startTime": "2023-06-15T10:00:00.000Z",
    "endTime": "2023-06-15T12:00:00.000Z",
    "status": "ACTIVE"
  }
}
```

## Running Tests

This project uses **Jest** for unit testing and **Supertest** for integration testing to ensure the reliability and correctness of the API endpoints and business logic.

### 1. Start the Test Environment

From the `server/` directory, run:
```bash
npm run pretest
```
This command starts a dedicated MongoDB instance for testing using Docker Compose.

### 2. Run the Test Suite

```bash
npm test
```

This command will run all tests with coverage reporting. The test suite includes:

- **Integration Tests:** Testing API endpoints with actual HTTP requests
- **Unit Tests:** Testing individual functions and modules in isolation

### 3. Watch Mode for Development

```bash
npm run test:watch
```

This will run tests in watch mode, automatically re-running tests when files change.

### 4. Stop the Test Environment

```bash
npm run posttest
```

This command stops and removes the Docker containers used for testing.

## Project Structure

```
server/
├── src/
│   ├── controllers/    # Handles HTTP requests and responses
│   ├── services/       # Business logic and data processing
│   ├── models/         # Data models and database schemas
│   ├── routes/         # API endpoint definitions
│   ├── config/         # Configuration files
│   ├── middlewares/    # Custom middleware functions
│   ├── utils/          # Utility functions and helpers
│   ├── repositories/   # Data access layer
│   ├── validations/    # Input validation schemas
│   ├── types/          # TypeScript type definitions
│   ├── docs/           # API documentation
│   │   └── swagger/    # Swagger documentation files
│   ├── app.ts          # Express application setup
│   └── server.ts       # Server entry point
├── test/
│   ├── api/            # End-to-end API tests
│   ├── integration/    # Integration tests
│   ├── unit/           # Unit tests for services and utilities
│   └── coverage/       # Test coverage reports
├── dist/               # Compiled JavaScript output
├── node_modules/       # Dependencies
├── .env                # Environment variables
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript configuration
├── jest.config.js      # Jest configuration
└── docker-compose.yml  # Docker configuration for testing
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.