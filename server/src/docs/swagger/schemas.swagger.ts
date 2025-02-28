/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *         librarian:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               libraryId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c86
 *               libraryName:
 *                 type: string
 *                 example: Central Library
 *
 *     Library:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c86
 *         name:
 *           type: string
 *           example: Central Library
 *         address:
 *           type: string
 *           example: 123 Main St, City
 *         description:
 *           type: string
 *           example: The main public library
 *         openingHours:
 *           type: object
 *           properties:
 *             monday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                   example: "09:00"
 *                 close:
 *                   type: string
 *                   example: "18:00"
 *             tuesday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                   example: "09:00"
 *                 close:
 *                   type: string
 *                   example: "18:00"
 *             wednesday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                   example: "09:00"
 *                 close:
 *                   type: string
 *                   example: "18:00"
 *             thursday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                   example: "09:00"
 *                 close:
 *                   type: string
 *                   example: "18:00"
 *             friday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                   example: "09:00"
 *                 close:
 *                   type: string
 *                   example: "18:00"
 *             saturday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                   example: "10:00"
 *                 close:
 *                   type: string
 *                   example: "16:00"
 *             sunday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                   example: "10:00"
 *                 close:
 *                   type: string
 *                   example: "14:00"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *
 *     Seat:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c87
 *         name:
 *           type: string
 *           example: A1
 *         libraryId:
 *           type: string
 *           example: 60d21b4667d0d8992e610c86
 *         location:
 *           type: string
 *           example: First Floor
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Power Outlet", "Window View"]
 *         status:
 *           type: string
 *           enum: [available, unavailable, maintenance]
 *           example: available
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c88
 *         userId:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *         seatId:
 *           type: string
 *           example: 60d21b4667d0d8992e610c87
 *         seat:
 *           $ref: '#/components/schemas/Seat'
 *         libraryId:
 *           type: string
 *           example: 60d21b4667d0d8992e610c86
 *         library:
 *           $ref: '#/components/schemas/Library'
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: 2023-04-01T10:00:00Z
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: 2023-04-01T12:00:00Z
 *         status:
 *           type: string
 *           enum: [active, completed, cancelled]
 *           example: active
 *         notes:
 *           type: string
 *           example: Group study session
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *
 *     Schedule:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c89
 *         libraryId:
 *           type: string
 *           example: 60d21b4667d0d8992e610c86
 *         date:
 *           type: string
 *           format: date
 *           example: 2023-04-01
 *         openingTime:
 *           type: string
 *           example: "09:00"
 *         closingTime:
 *           type: string
 *           example: "18:00"
 *         isClosed:
 *           type: boolean
 *           example: false
 *         notes:
 *           type: string
 *           example: Special hours for holiday
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-03-01T12:00:00Z
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         totalItems:
 *           type: integer
 *           example: 100
 *         totalPages:
 *           type: integer
 *           example: 10
 *         currentPage:
 *           type: integer
 *           example: 1
 *         itemsPerPage:
 *           type: integer
 *           example: 10
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error message
 *         status:
 *           type: integer
 *           example: 400
 *
 *   responses:
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Validation error
 *               status:
 *                 type: integer
 *                 example: 400
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                       example: email
 *                     message:
 *                       type: string
 *                       example: Email is required
 *
 *     UnauthorizedError:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             message: Unauthorized - Invalid or missing token
 *             status: 401
 *
 *     ForbiddenError:
 *       description: Forbidden
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             message: Forbidden - Insufficient permissions
 *             status: 403
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */ 