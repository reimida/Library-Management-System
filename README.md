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