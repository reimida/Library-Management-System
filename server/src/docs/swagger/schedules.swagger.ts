/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Library schedule management endpoints
 */

/**
 * @swagger
 * /libraries/{libraryId}/schedules:
 *   post:
 *     summary: Create a new schedule for a library
 *     tags: [Schedules]
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
 *               - date
 *               - openingTime
 *               - closingTime
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2023-04-01"
 *               openingTime:
 *                 type: string
 *                 example: "09:00"
 *               closingTime:
 *                 type: string
 *                 example: "18:00"
 *               isClosed:
 *                 type: boolean
 *                 example: false
 *               notes:
 *                 type: string
 *                 example: "Special hours for holiday"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schedule created successfully
 *                 schedule:
 *                   $ref: '#/components/schemas/Schedule'
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
 *       409:
 *         description: Schedule already exists for this date
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Schedule already exists for this date
 *               status: 409
 */

/**
 * @swagger
 * /libraries/{libraryId}/schedules:
 *   get:
 *     summary: Get all schedules for a library
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter schedules by start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter schedules by end date (YYYY-MM-DD)
 *       - in: query
 *         name: isClosed
 *         schema:
 *           type: boolean
 *         description: Filter schedules by closed status
 *     responses:
 *       200:
 *         description: List of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedules:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Schedule'
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
 * /libraries/{libraryId}/schedules/{scheduleId}:
 *   get:
 *     summary: Get schedule by ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedule:
 *                   $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Schedule or library not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Schedule or library not found
 *               status: 404
 */

/**
 * @swagger
 * /libraries/{libraryId}/schedules/{scheduleId}:
 *   patch:
 *     summary: Update schedule
 *     tags: [Schedules]
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
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               openingTime:
 *                 type: string
 *                 example: "10:00"
 *               closingTime:
 *                 type: string
 *                 example: "17:00"
 *               isClosed:
 *                 type: boolean
 *                 example: true
 *               notes:
 *                 type: string
 *                 example: "Closed for maintenance"
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schedule updated successfully
 *                 schedule:
 *                   $ref: '#/components/schemas/Schedule'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Schedule or library not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Schedule or library not found
 *               status: 404
 */

/**
 * @swagger
 * /libraries/{libraryId}/schedules/{scheduleId}:
 *   delete:
 *     summary: Delete schedule
 *     tags: [Schedules]
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
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schedule deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Schedule or library not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Schedule or library not found
 *               status: 404
 */ 