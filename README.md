1|# Library Seats Booking Backend

## Project Description

Develop a RESTful backend in Node.js for the efficient management of seat reservations within a library. The application aims to provide a centralized system for users to book study seats and for the library administration to manage availability and reservations.

## Tech Stack

*   **Backend Framework:** Node.js with Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB
*   **ORM/ODM:** Mongoose
*   **Authentication:** JWT
*   **Testing:** Jest and Supertest
*   **Documentation:** Swagger or OpenAPI (To be implemented)
*   **Linting and Formatting:** ESLint and Prettier

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v20 or higher recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/)
*   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for testing environment)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration

1.  **Environment Variables:**
    *   Create a `.env` file in the `server/` directory.
    *   Add your MongoDB connection string. Example:
        ```env
        DATABASE_URL=mongodb://localhost:27017/library_seats
        PORT=3000 # Optional: to run on a different port
        ```

2.  **Database:**
    *   Ensure MongoDB is installed and running. You can start it locally using:
        ```bash
        mongod
        ```
        (Make sure MongoDB `bin` directory is in your system's `PATH`)

### Running the Backend

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the server using `ts-node-dev` for automatic restarting on code changes. The server will be accessible at `http://localhost:3000` (or the port specified in your `.env` file).

## API Usage Examples


### Register a New User

You can register a new user by sending a POST request to the `/users/register` endpoint.

**Example using `curl`:**

bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{
"name": "John Doe",
"email": "john.doe@example.com",
"password": "securePassword123"
}' \
http://localhost:3000/users/register


**Expected Response (Success - HTTP 201 Created):**

json
{
"message": "User registered successfully",
"user": {
"email": "john.doe@example.com",
"name": "John Doe"
}
}


**Verifying User Registration in MongoDB:**

1.  Open a MongoDB client or use the MongoDB shell (`mongo`).
2.  Connect to your local MongoDB instance and the `library_seats` database.
3.  Query the `users` collection to find the newly registered user:

    ```javascript
    db.users.find({ email: "john.doe@example.com" })
    ```

    You should see a document containing the user's information (excluding the password from the response, but stored hashed in the database).

## Running Tests

This project uses **Jest** for unit testing and **Supertest** for integration testing to ensure the reliability and correctness of the API endpoints and business logic. Supertest is used to test the API endpoints by making actual HTTP requests to the running server.

Before running the tests, ensure Docker and Docker Compose are installed and running on your system.

### 1. Start the Test Environment

The test suite requires a running MongoDB instance. Docker Compose is used to easily set up a dedicated MongoDB environment for testing.

From the `server/` directory, run:
```bash
docker-compose up -d
```
This command starts the MongoDB service defined in `docker-compose.yml` in detached mode. This MongoDB instance is configured specifically for testing and will not interfere with your local development MongoDB setup.

### 2. Run the Test Suite

Once the Docker environment is up and running, you can execute the test suite using npm:
```bash
npm test

This command will run Jest, which will execute all test files located in the `test/` directory. The test suite includes:

*   **Integration Tests:** Located in `test/integration/`, these tests use Supertest to send HTTP requests to the API endpoints and verify the responses. They test the full flow of API requests, including controllers, services, and database interactions. Examples include testing user registration, login, and profile management.
*   **Unit Tests:** Located in `test/unit/`, these tests focus on testing individual functions or modules in isolation, such as services and utility functions.

### 3. Stop the Test Environment (Optional)

After running tests, you can stop the Docker Compose environment:

bash
docker-compose down

This command stops and removes the containers started by `docker-compose up`, cleaning up the test environment.

By following these steps, you can ensure your backend is thoroughly tested and functions as expected.