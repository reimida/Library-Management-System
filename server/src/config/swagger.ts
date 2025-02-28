import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Library Seats Booking System API',
    version: '1.0.0',
    description: 'A comprehensive RESTful API for managing seat reservations in libraries',
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC',
    },
    contact: {
      name: 'API Support',
      email: 'support@libraryseats.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          id: {
            type: 'string',
            description: 'User ID',
            example: '60d21b4667d0d8992e610c85',
          },
          name: {
            type: 'string',
            description: 'User name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            description: 'User password (hashed)',
            example: '$2a$10$...',
          },
          role: {
            type: 'string',
            enum: ['USER', 'LIBRARIAN', 'ADMIN'],
            description: 'User role',
            example: 'USER',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User ID',
            example: '60d21b4667d0d8992e610c85',
          },
          name: {
            type: 'string',
            description: 'User name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john.doe@example.com',
          },
          role: {
            type: 'string',
            enum: ['USER', 'LIBRARIAN', 'ADMIN'],
            description: 'User role',
            example: 'USER',
          },
        },
      },
      Library: {
        type: 'object',
        required: ['name', 'libraryCode', 'address', 'contactPhone', 'contactEmail', 'totalSeats'],
        properties: {
          id: {
            type: 'string',
            description: 'Library ID',
            example: '60d21b4667d0d8992e610c85',
          },
          name: {
            type: 'string',
            description: 'Library name',
            example: 'Central Library',
          },
          libraryCode: {
            type: 'string',
            description: 'Unique library code',
            example: 'CENTRAL01',
          },
          address: {
            type: 'object',
            properties: {
              street: {
                type: 'string',
                example: '123 Main St',
              },
              city: {
                type: 'string',
                example: 'New York',
              },
              state: {
                type: 'string',
                example: 'NY',
              },
              postalCode: {
                type: 'string',
                example: '10001',
              },
              country: {
                type: 'string',
                example: 'USA',
              },
            },
          },
          contactPhone: {
            type: 'string',
            example: '+1 212-555-1234',
          },
          contactEmail: {
            type: 'string',
            format: 'email',
            example: 'info@centrallibrary.com',
          },
          totalSeats: {
            type: 'integer',
            example: 100,
          },
          isActive: {
            type: 'boolean',
            example: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Schedule: {
        type: 'object',
        required: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        properties: {
          id: {
            type: 'string',
            description: 'Schedule ID',
            example: '60d21b4667d0d8992e610c85',
          },
          libraryId: {
            type: 'string',
            description: 'Library ID',
            example: '60d21b4667d0d8992e610c85',
          },
          monday: {
            type: 'object',
            properties: {
              open: {
                type: 'string',
                example: '09:00',
              },
              close: {
                type: 'string',
                example: '17:00',
              },
            },
          },
          tuesday: {
            type: 'object',
            properties: {
              open: {
                type: 'string',
                example: '09:00',
              },
              close: {
                type: 'string',
                example: '17:00',
              },
            },
          },
          wednesday: {
            type: 'object',
            properties: {
              open: {
                type: 'string',
                example: '09:00',
              },
              close: {
                type: 'string',
                example: '17:00',
              },
            },
          },
          thursday: {
            type: 'object',
            properties: {
              open: {
                type: 'string',
                example: '09:00',
              },
              close: {
                type: 'string',
                example: '17:00',
              },
            },
          },
          friday: {
            type: 'object',
            properties: {
              open: {
                type: 'string',
                example: '09:00',
              },
              close: {
                type: 'string',
                example: '17:00',
              },
            },
          },
          saturday: {
            type: 'object',
            properties: {
              open: {
                type: 'string',
                example: '10:00',
              },
              close: {
                type: 'string',
                example: '15:00',
              },
            },
          },
          sunday: {
            type: 'object',
            properties: {
              open: {
                type: 'string',
                example: '10:00',
              },
              close: {
                type: 'string',
                example: '15:00',
              },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Seat: {
        type: 'object',
        required: ['code', 'floor', 'area', 'libraryId'],
        properties: {
          id: {
            type: 'string',
            description: 'Seat ID',
            example: '60d21b4667d0d8992e610c85',
          },
          code: {
            type: 'string',
            description: 'Seat code',
            example: 'A101',
          },
          floor: {
            type: 'string',
            description: 'Floor',
            example: '1st Floor',
          },
          area: {
            type: 'string',
            description: 'Area',
            example: 'Quiet Zone',
          },
          status: {
            type: 'string',
            enum: ['AVAILABLE', 'RESERVED', 'OUT_OF_SERVICE'],
            description: 'Seat status',
            example: 'AVAILABLE',
          },
          libraryId: {
            type: 'string',
            description: 'Library ID',
            example: '60d21b4667d0d8992e610c85',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Reservation: {
        type: 'object',
        required: ['userId', 'seatId', 'startTime', 'endTime'],
        properties: {
          id: {
            type: 'string',
            description: 'Reservation ID',
            example: '60d21b4667d0d8992e610c85',
          },
          userId: {
            type: 'string',
            description: 'User ID',
            example: '60d21b4667d0d8992e610c85',
          },
          seatId: {
            type: 'string',
            description: 'Seat ID',
            example: '60d21b4667d0d8992e610c85',
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            description: 'Reservation start time',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            description: 'Reservation end time',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'CANCELLED', 'COMPLETED'],
            description: 'Reservation status',
            example: 'ACTIVE',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
            example: 'Resource not found',
          },
          status: {
            type: 'integer',
            description: 'HTTP status code',
            example: 404,
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              message: 'Unauthorized',
              status: 401,
            },
          },
        },
      },
      ForbiddenError: {
        description: 'User does not have permission to access this resource',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              message: 'Forbidden',
              status: 403,
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              message: 'Resource not found',
              status: 404,
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              message: 'Validation failed',
              status: 400,
              errors: [
                {
                  field: 'email',
                  message: 'Invalid email format',
                },
              ],
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User registration and authentication endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Libraries',
      description: 'Library management endpoints',
    },
    {
      name: 'Schedules',
      description: 'Library schedule management endpoints',
    },
    {
      name: 'Seats',
      description: 'Seat management endpoints',
    },
    {
      name: 'Reservations',
      description: 'Reservation management endpoints',
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to the API routes files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 