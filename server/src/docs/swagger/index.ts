import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

// Import all swagger files to ensure they are included in the documentation
import './schemas.swagger';
import './users.swagger';
import './libraries.swagger';
import './seats.swagger';
import './reservations.swagger';
import './schedules.swagger';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Seat Reservation API',
      version: '1.0.0',
      description: 'API for managing library seat reservations',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
  },
  apis: [
    path.resolve(__dirname, '*.swagger.ts'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 