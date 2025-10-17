/**
 * @openapi
 * /api/users/tickets:
 *   post:
 *     summary: Open a support ticket
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created
 *       401:
 *         description: Not authenticated
 *   get:
 *     summary: List my tickets
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *       401:
 *         description: Not authenticated
 * /api/users/tickets/all:
 *   get:
 *     summary: List all tickets (admin only)
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tickets
 *       403:
 *         description: Admin access required
 * /api/users/tickets/{ticketId}/respond:
 *   post:
 *     summary: Admin respond to a ticket
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, closed]
 *     responses:
 *       200:
 *         description: Ticket updated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Ticket not found
 */
router.post('/tickets', authMiddleware, openTicket);
router.get('/tickets', authMiddleware, listMyTickets);
router.get('/tickets/all', authMiddleware, isAdmin, listAllTickets);
router.post('/tickets/:ticketId/respond', authMiddleware, isAdmin, respondTicket);
/**
 * @openapi
 * /api/users/notifications:
 *   get:
 *     summary: List user notifications
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Not authenticated
 * /api/users/notifications/mark-read:
 *   post:
 *     summary: Mark all notifications as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Not authenticated
 */
router.get('/notifications', authMiddleware, listNotifications);
router.post('/notifications/mark-read', authMiddleware, markNotificationsRead);
/**
 * @openapi
 * /api/users/verification/manual-queue:
 *   get:
 *     summary: List manual verification requests (admin only)
 *     description: Returns all verification requests pending manual review, including user data and image paths.
 *     tags:
 *       - Verification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of manual verification requests
 *       403:
 *         description: Admin access required
 */
router.get("/verification/manual-queue", authMiddleware, isAdmin, listManualVerifications);
const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  submitVerification,
  stripeOnboard,
  stripeComplete
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

const { isAdmin } = require("../middlewares/auth");
/**
 * @openapi
 * /api/users/verification/{requestId}/manual-review:
 *   post:
 *     summary: Admin manual verification review
 *     description: Approve or reject a user's verification request (admin only).
 *     tags:
 *       - Verification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               decision:
 *                 type: string
 *                 enum: [approve, reject]
 *                 example: approve
 *               notes:
 *                 type: string
 *                 example: "ID photo is clear."
 *     responses:
 *       200:
 *         description: Verification reviewed
 *       400:
 *         description: Invalid input or request
 *       403:
 *         description: Admin access required
 */
router.post("/verification/:requestId/manual-review", authMiddleware, isAdmin, manualVerificationReview);

const router = express.Router();

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_Name
 *               - last_Name
 *               - email
 *               - adress
 *               - password
 *             properties:
 *               first_Name:
 *                 type: string
 *                 example: John
 *               last_Name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               adress:
 *                 type: string
 *                 example: 123 Main Street
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     first_Name:
 *                       type: string
 *                       example: Mazine
 *                     last_Name:
 *                       type: string
 *                       example: Zagui
 *                     email:
 *                       type: string
 *                       example: mazine.sda3@example.com
 *                     adress:
 *                       type: string
 *                       example: berkane Rue 13
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already registered
 */
router.post("/register", registerUser);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Authenticate a user and return a JWT
 *     description: Validates user credentials and returns a JWT token with user data.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     first_Name:
 *                       type: string
 *                       example: John
 *                     last_Name:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     adress:
 *                       type: string
 *                       example: 123 Main Street
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post("/login", loginUser);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Get user profile
 *     description: Returns the authenticated user's profile information.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 652dbfae23adcf9281f119e2
 *                 first_Name:
 *                   type: string
 *                   example: John
 *                 last_Name:
 *                   type: string
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 adress:
 *                   type: string
 *                   example: 123 Main Street
 *                 role:
 *                   type: string
 *                   example: user
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 */
router.get("/me", authMiddleware, getProfile);

/**
 * @openapi
 * /api/users/verification:
 *   post:
 *     summary: Submit user verification
 *     description: Uploads verification data for manual or automated review.
 *     tags:
 *       - Verification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               verification_type:
 *                 type: string
 *                 example: National ID
 *               verification_id:
 *                 type: string
 *                 example: AB123456
 *               verify_card_Image:
 *                 type: string
 *                 format: binary
 *                 description: Image of ID card
 *               verificationSelfie:
 *                 type: string
 *                 format: binary
 *                 description: Selfie with ID card
 *     responses:
 *       200:
 *         description: Verification submitted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post("/verification", authMiddleware, submitVerification);

// Stripe Connect onboarding endpoints
router.post('/stripe/onboard', authMiddleware, stripeOnboard);
router.get('/stripe/complete', authMiddleware, stripeComplete);

module.exports = router;
