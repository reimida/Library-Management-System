import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../docs/swagger';

/**
 * Configure Swagger UI for the Express application
 * @param app Express application
 */
export function setupSwagger(app: Application): void {
  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve Swagger spec as JSON at /swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger UI available at /api-docs');
} 