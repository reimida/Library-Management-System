/**
 * @swagger
 * tags:
 *   name: Libraries
 *   description: Library management endpoints
 */

/**
 * @swagger
 * /libraries:
 *   post:
 *     summary: Create a new library
 *     tags: [Libraries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: Central Library
 *               address:
 *                 type: string
 *                 example: 123 Main St, City
 *               description:
 *                 type: string
 *                 example: The main public library
 *               openingHours:
 *                 type: object
 *                 properties:
 *                   monday:
 *                     type: object
 *                     properties:
 *                       open:
 *                         type: string
 *                         example: "09:00"
 *                       close:
 *                         type: string
 *                         example: "18:00"
 *                   tuesday:
 *                     type: object
 *                     properties:
 *                       open:
 *                         type: string
 *                         example: "09:00"
 *                       close:
 *                         type: string
 *                         example: "18:00"
 *                   wednesday:
 *                     type: object
 *                     properties:
 *                       open:
 *                         type: string
 *                         example: "09:00"
 *                       close:
 *                         type: string
 *                         example: "18:00"
 *                   thursday:
 *                     type: object
 *                     properties:
 *                       open:
 *                         type: string
 *                         example: "09:00"
 *                       close:
 *                         type: string
 *                         example: "18:00"
 *                   friday:
 *                     type: object
 *                     properties:
 *                       open:
 *                         type: string
 *                         example: "09:00"
 *                       close:
 *                         type: string
 *                         example: "18:00"
 *                   saturday:
 *                     type: object
 *                     properties:
 *                       open:
 *                         type: string
 *                         example: "10:00"
 *                       close:
 *                         type: string
 *                         example: "16:00"
 *                   sunday:
 *                     type: object
 *                     properties:
 *                       open:
 *                         type: string
 *                         example: "10:00"
 *                       close:
 *                         type: string
 *                         example: "14:00"
 *     responses:
 *       201:
 *         description: Library created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Library created successfully
 *                 library:
 *                   $ref: '#/components/schemas/Library'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /libraries:
 *   get:
 *     summary: Get all libraries
 *     tags: [Libraries]
 *     parameters:
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for library name
 *     responses:
 *       200:
 *         description: List of libraries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 libraries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Library'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /libraries/{libraryId}:
 *   get:
 *     summary: Get library by ID
 *     tags: [Libraries]
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *     responses:
 *       200:
 *         description: Library details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 library:
 *                   $ref: '#/components/schemas/Library'
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
 * /libraries/{libraryId}:
 *   patch:
 *     summary: Update library
 *     tags: [Libraries]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Library Name
 *               address:
 *                 type: string
 *                 example: 456 New St, City
 *               description:
 *                 type: string
 *                 example: Updated description
 *               openingHours:
 *                 type: object
 *                 properties:
 *                   monday:
 *                     type: object
 *                     properties:
 *                       open:
 *                         type: string
 *                         example: "08:00"
 *                       close:
 *                         type: string
 *                         example: "19:00"
 *     responses:
 *       200:
 *         description: Library updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Library updated successfully
 *                 library:
 *                   $ref: '#/components/schemas/Library'
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
 * /libraries/{libraryId}:
 *   delete:
 *     summary: Delete library
 *     tags: [Libraries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *     responses:
 *       200:
 *         description: Library deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Library deleted successfully
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
 * /libraries/{libraryId}/librarians:
 *   get:
 *     summary: Get all librarians for a library
 *     tags: [Libraries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Library ID
 *     responses:
 *       200:
 *         description: List of librarians
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 librarians:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
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