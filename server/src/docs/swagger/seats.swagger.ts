/**
 * @swagger
 * tags:
 *   name: Seats
 *   description: Seat management endpoints
 */

/**
 * @swagger
 * /libraries/{libraryId}/seats:
 *   post:
 *     summary: Create a new seat
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: "A1"
 *               location:
 *                 type: string
 *                 example: "First Floor"
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Power Outlet", "Window View"]
 *               status:
 *                 type: string
 *                 enum: [available, unavailable, maintenance]
 *                 example: "available"
 *     responses:
 *       201:
 *         description: Seat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seat created successfully
 *                 seat:
 *                   $ref: '#/components/schemas/Seat'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Library not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Library not found
 *               status: 404
 */

/**
 * @swagger
 * /libraries/{libraryId}/seats:
 *   get:
 *     summary: Get all seats in a library
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, unavailable, maintenance]
 *         description: Filter seats by status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter seats by location
 *       - in: query
 *         name: features
 *         schema:
 *           type: string
 *         description: Filter seats by features (comma-separated)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of seats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seats:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Seat'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Library not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Library not found
 *               status: 404
 */

/**
 * @swagger
 * /libraries/{libraryId}/seats/{seatId}:
 *   get:
 *     summary: Get seat by ID
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seat ID
 *     responses:
 *       200:
 *         description: Seat details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seat:
 *                   $ref: '#/components/schemas/Seat'
 *       404:
 *         description: Seat or library not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Seat or library not found
 *               status: 404
 */

/**
 * @swagger
 * /libraries/{libraryId}/seats/{seatId}:
 *   patch:
 *     summary: Update seat
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "A2"
 *               location:
 *                 type: string
 *                 example: "Second Floor"
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Power Outlet", "Quiet Zone"]
 *               status:
 *                 type: string
 *                 enum: [available, unavailable, maintenance]
 *                 example: "maintenance"
 *     responses:
 *       200:
 *         description: Seat updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seat updated successfully
 *                 seat:
 *                   $ref: '#/components/schemas/Seat'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Seat or library not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Seat or library not found
 *               status: 404
 */

/**
 * @swagger
 * /libraries/{libraryId}/seats/{seatId}:
 *   delete:
 *     summary: Delete seat
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seat ID
 *     responses:
 *       200:
 *         description: Seat deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seat deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Seat or library not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Seat or library not found
 *               status: 404
 */ 