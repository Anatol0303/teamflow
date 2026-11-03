import { Router } from 'express';
import { UserController } from './user.controller';
import { UserServiceImpl } from './user.service.impl';
import { validateDto } from '../../middlewares/validate';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rolesMiddleware } from '../../middlewares/roles.middleware';
import { UserRole } from '../../entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ChangeEmailDto } from './dto/ChangeEmailDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';

const router = Router();

const service = new UserServiceImpl();
const controller = new UserController(service);

// =========================
// REGISTER USER
// =========================

/**
 * @swagger
 * /users/createUser:
 *   post:
 *     summary: Register new user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *
 *       400:
 *         description: Bad Request — invalid input, duplicate email, or registration is not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *             examples:
 *               duplicateEmail:
 *                 summary: Email already exists
 *                 value:
 *                   status: 400
 *                   message: User with this email already exists
 *               invalidEmail:
 *                 summary: Invalid email
 *                 value:
 *                   status: 400
 *                   message: email must be an email
 *               noAdmin:
 *                 summary: No ADMIN exists
 *                 value:
 *                   status: 400
 *                   message: There are not ADMIN in application. You can register only like ADMIN.
 *               adminExists:
 *                 summary: ADMIN already exists
 *                 value:
 *                   status: 400
 *                   message: "During this time 1 admin has appeared in application.\nNow You can registrate only like usual USER"
 *
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *             example:
 *               status: 500
 *               message: Internal Server Error
 */

router.post(
    '/createUser',
    validateDto(CreateUserDto),
    controller.createUser.bind(controller)
);

/**
 * @swagger
 * /users/createAdmin:
 *   post:
 *     summary: Register the first admin
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *
 *       400:
 *         description: Bad Request — invalid input or an admin already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *             examples:
 *               invalidEmail:
 *                 summary: Invalid email
 *                 value:
 *                   status: 400
 *                   message: email must be an email
 *               adminAlreadyExists:
 *                 summary: Admin already exists
 *                 value:
 *                   status: 400
 *                   message: "During this time 1 admin has appeared in application.\nNow You can registrate only like usual USER"
 *
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *             example:
 *               status: 500
 *               message: Internal Server Error
 */

router.post(
    '/createAdmin',
    validateDto(CreateUserDto),
    controller.createAdmin.bind(controller)
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad Request — invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: password must be a string
 *               required:
 *                 - status
 *                 - message
 *       401:
 *         description: Unauthorized — invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *               required:
 *                 - status
 *                 - message
 */

router.post(
    '/login',
    validateDto(LoginDto),
    controller.login.bind(controller)
);

/**
 * @swagger
 * /users/admin-select-list:
 *   get:
 *     summary: Get users for admin select list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponseDto'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get(
    '/admin-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.ADMIN),
    controller.getAllUsers.bind(controller)
);

/**
 * @swagger
 * /users/admin-select-list-admins:
 *   get:
 *     summary: Get users for admin select list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponseDto'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get(
    '/admin-select-list-admins',
    authMiddleware,
    rolesMiddleware(UserRole.ADMIN),
    controller.getAllAdmins.bind(controller)
);

/**
 * @swagger
 * /users/admin-select-list-admins-without-token:
 *   get:
 *     summary: Check whether any ADMIN users exist
 *     tags: [Users]
 *     security: []
 *     responses:
 *       200:
 *         description: Indicates whether there are no ADMIN users
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: false
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get(
    '/admin-select-list-admins-without-token',
    controller.existNoExistAdmins.bind(controller)
);

/**
 * @swagger
 * /users/make-admin-select-list:
 *   get:
 *     summary: Get users who can be promoted to ADMIN
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users who do not belong to any team
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponseDto'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: No USER accounts available
 *               required:
 *                 - status
 *                 - message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get(
    '/make-admin-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.ADMIN),
    controller.getMakeAdminSelectList.bind(controller)
);

/**
 * @swagger
 * /users/remove-admin-select-list:
 *   get:
 *     summary: Get ADMIN users who can be removed
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ADMIN users excluding the current ADMIN and users who belong to a team
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponseDto'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get(
    '/remove-admin-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.ADMIN),
    controller.getRemoveAdminSelectList.bind(controller)
);

/**
 * @swagger
 * /users/{userId}/make-admin:
 *   patch:
 *     summary: Promote a user to ADMIN
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 163
 *     responses:
 *       200:
 *         description: User successfully promoted to ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MakeAdminResponseDto'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid userId
 *               required:
 *                 - status
 *                 - message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.patch(
    '/:userId/make-admin',
    authMiddleware,
    rolesMiddleware(UserRole.ADMIN),
    controller.makeAdmin.bind(controller)
);

/**
 * @swagger
 * /users/{userId}/remove-admin:
 *   delete:
 *     summary: Remove an ADMIN user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 163
 *     responses:
 *       204:
 *         description: ADMIN successfully removed
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid userId
 *               required:
 *                 - status
 *                 - message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.delete(
    '/:userId/remove-admin',
    authMiddleware,
    rolesMiddleware(UserRole.ADMIN),
    controller.removeAdmin.bind(controller)
);

/**
 * @swagger
 * /users/self-remove-admin:
 *   delete:
 *     summary: Remove own ADMIN account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: ADMIN account successfully removed
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Cannot remove yourself! You are only ADMIN
 *               required:
 *                 - status
 *                 - message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.delete(
    '/self-remove-admin',
    authMiddleware,
    rolesMiddleware(UserRole.ADMIN),
    controller.selfRemoveAdmin.bind(controller)
);

/**
 * @swagger
 * /users/self-remove-user:
 *   delete:
 *     summary: Remove own USER account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: USER account successfully removed
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: USER cannot remove own account while being a member of a team
 *               required:
 *                 - status
 *                 - message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.delete(
    '/self-remove-user',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.selfRemoveUser.bind(controller)
);

/**
 * @swagger
 * /users/change-email:
 *   patch:
 *     summary: Change own email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeEmailDto'
 *     responses:
 *       200:
 *         description: Email successfully changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: User with this email already exists
 *               required:
 *                 - status
 *                 - message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.patch(
    '/change-email',
    authMiddleware,
    validateDto(ChangeEmailDto),
    controller.changeEmail.bind(controller)
);

/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     summary: Change own password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordDto'
 *     responses:
 *       204:
 *         description: Password successfully changed
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Current password is incorrect
 *               required:
 *                 - status
 *                 - message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: No token provided
 *               required:
 *                 - status
 *                 - message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.patch(
    '/change-password',
    authMiddleware,
    validateDto(ChangePasswordDto),
    controller.changePassword.bind(controller)
);

export default router;