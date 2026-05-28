const { Router } = require('express');
const controller = require('./auth.controller');
const { loginRules, changePasswordRules } = require('./auth.validation');
const { validate } = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and obtain a JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginRules, validate, controller.login);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get('/profile', authenticate, controller.getProfile);

/**
 * @openapi
 * /auth/change-password:
 *   patch:
 *     summary: Change password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 */
router.patch('/change-password', authenticate, changePasswordRules, validate, controller.changePassword);

module.exports = router;
