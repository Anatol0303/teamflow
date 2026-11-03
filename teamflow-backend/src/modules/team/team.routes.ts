import { Router } from 'express';
import { TeamController } from './team.controller';
import { TeamServiceImpl } from './team.service.impl';
import { rolesMiddleware } from '../../middlewares/roles.middleware';
import { UserRole } from '../../entities/User';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateDto } from '../../middlewares/validate';

import { CreateTeamDto } from './dto/create-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { GetTeamsDto } from './dto/get-teams.dto';
import { RenameTeamDto } from './dto/rename-team.dto'
const router = Router();

const service = new TeamServiceImpl();
const controller = new TeamController(service);

/**
 * @swagger
 * /teams/admin-select-list:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   teamId:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Backend Team
 *                   createdBy:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-01-01T12:00:00.000Z
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
    controller.getAllTeams.bind(controller)
);

// =========================
// CREATE NEW TEAM
// =========================

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team for the authenticated user
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeamDto'
 *     responses:
 *       201:
 *         description: Team created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teamId:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Backend Team
 *                 createdBy:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-01-01T12:00:00.000Z
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
 *                   example: Error! You already own a team with this name
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
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

router.post(
    '/',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    validateDto(CreateTeamDto),
    controller.create.bind(controller)
);

/**
 * @swagger
 * /teams/my-renameable-select-list:
 *   get:
 *     summary: Get teams that the authenticated user can rename
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams that the user can rename
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamSelectResponse'
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
    '/my-renameable-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getMyRenameableTeamsSelectList.bind(controller)
);

/**
 * @swagger
 * /teams/{teamId}/rename:
 *   patch:
 *     summary: Rename a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RenameTeamDto'
 *     responses:
 *       204:
 *         description: Team renamed successfully
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
 *                   example: Invalid teamId
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
 *                   example: You do not have permission to rename this team
 *               required:
 *                 - status
 *                 - message
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Team not found
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

router.patch(
    '/:teamId/rename',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    validateDto(RenameTeamDto),
    controller.renameTeam.bind(controller)
);


// =========================
// GET USER TEAMS (pagination + search + sorting)
// =========================

/**
 * @swagger
 * /teams/my:
 *   get:
 *     summary: Get authenticated user's teams with pagination, search, and sorting
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: backend
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, name]
 *           example: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *     responses:
 *       200:
 *         description: List of user's teams
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTeamsResponse'
 *       400:
 *         description: Invalid query parameters
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
 *                   example: page must not be less than 1
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
 *               required:
 *                 - status
 *                 - message
 */

router.get(
    '/my',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    validateDto(GetTeamsDto, 'query'),
    controller.getUserTeams.bind(controller)
);

// =========================
// GET OWNED TEAMS
// =========================

/**
 * @swagger
 * /teams/my-owned:
 *   get:
 *     summary: Get teams owned by the authenticated user with pagination, search, and sorting
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: backend
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - name
 *           example: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           example: desc
 *     responses:
 *       200:
 *         description: List of owned teams
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnedTeamsResponse'
 *       400:
 *         description: Invalid query parameters
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
 *                   example: page must not be less than 1
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
 *               required:
 *                 - status
 *                 - message
 */

router.get(
    '/my-owned',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    validateDto(GetTeamsDto, 'query'),
    controller.getUserOwnTeams.bind(controller)
);


// =========================
// GET MANAGEABLE TEAMS
// =========================

/**
 * @swagger
 * /teams/my-manageable:
 *   get:
 *     summary: Get teams managed by the authenticated user with pagination, search, and sorting
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: backend
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, name]
 *           example: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *     responses:
 *       200:
 *         description: List of manageable teams
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ManagedTeamsResponse'
 *       400:
 *         description: Invalid query parameters
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
 *                   example: page must not be less than 1
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
 *               required:
 *                 - status
 *                 - message
 */

router.get(
    '/my-manageable',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    validateDto(GetTeamsDto, 'query'),
    controller.getUserManageableTeams.bind(controller)
);

/**
 * @swagger
 * /teams/my-member:
 *   get:
 *     summary: Get teams where the authenticated user is a member with pagination, search, and sorting
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: backend
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, name]
 *           example: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *     responses:
 *       200:
 *         description: List of member teams
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberTeamsResponse'
 *       400:
 *         description: Invalid query parameters
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
 *                   example: page must not be less than 1
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
 *               required:
 *                 - status
 *                 - message
 */

router.get(
    '/my-member',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    validateDto(GetTeamsDto, 'query'),
    controller.getUserMemberTeams.bind(controller)
);

// =========================
// TEAM SELECT LISTS
// =========================


/**
 * @swagger
 * /teams/my-select-list:
 *   get:
 *     summary: Get all user teams for dropdown list
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamSelectResponse'
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
 *               required:
 *                 - status
 *                 - message
 */

router.get(
    '/my-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getMyTeamsSelectList.bind(controller)
);

/**
 * @swagger
 * /teams/my-manageable-select-list:
 *   get:
 *     summary: Get user manageable teams for dropdown list
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of manageable user teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamSelectResponse'
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
 *               required:
 *                 - status
 *                 - message
 */

router.get(
    '/my-manageable-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getMyManageableTeamsSelectList.bind(controller)
);

/**
 * @swagger
 * /teams/my-owned-select-list:
 *   get:
 *     summary: Get user owned teams for dropdown list
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of owned user teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamSelectResponse'
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
 *               required:
 *                 - status
 *                 - message
 */

router.get(
    '/my-owned-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getMyOwnedTeamsSelectList.bind(controller)
);

/**
 * @swagger
 * /teams/my-removable-select-list:
 *   get:
 *     summary: Get teams where the current user can remove members
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams where the current user can remove at least one member
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamSelectResponse'
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
 *               required:
 *                 - status
 *                 - message
 */

router.get(
    '/my-removable-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getMyTeamsForMemberRemoval.bind(controller)
);

// =========================
// ADD MEMBER
// =========================

/**
 * @swagger
 * /teams/{teamId}/members:
 *   post:
 *     summary: Add user to team
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 111
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddTeamMemberDto'
 *     responses:
 *       200:
 *         description: User added to team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member added
 *
 *       400:
 *         description: Invalid request data or invalid team membership operation
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
 *                   example: User is already in team
 *               required:
 *                 - status
 *                 - message
 *             examples:
 *               userAlreadyInTeam:
 *                 summary: User is already a team member
 *                 value:
 *                   status: 400
 *                   message: User is already in team
 *               adminCannotBeAdded:
 *                 summary: ADMIN cannot be added
 *                 value:
 *                   status: 400
 *                   message: Cannot add ADMIN to team
 *               ownerRoleNotAllowed:
 *                 summary: OWNER role cannot be assigned
 *                 value:
 *                   status: 400
 *                   message: Use transfer ownership to assign OWNER role
 *               noUsersAvailable:
 *                 summary: No users available to add
 *                 value:
 *                   status: 400
 *                   message: No users available to add
 *               invalidUserId:
 *                 summary: Invalid userId
 *                 value:
 *                   status: 400
 *                   message: userId must be an integer number
 *               invalidRole:
 *                 summary: Invalid role
 *                 value:
 *                   status: 400
 *                   message: "role must be one of the following values: OWNER, MANAGER, MEMBER"
 *
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
 *
 *       403:
 *         description: User does not have permission to add members
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
 *                   example: Only OWNER or MANAGER can add members
 *             examples:
 *               memberCannotAdd:
 *                 summary: MEMBER cannot add users
 *                 value:
 *                   status: 403
 *                   message: Only OWNER or MANAGER can add members
 *               notTeamMember:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: You are not in this team
 *               adminAccess:
 *                 summary: ADMIN cannot access USER team operations
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *
 *       404:
 *         description: Team or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Team not found
 *             examples:
 *               teamNotFound:
 *                 summary: Team not found
 *                 value:
 *                   status: 404
 *                   message: Team not found
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   status: 404
 *                   message: User not found
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
 *
 */

router.post(
    '/:teamId/members',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    validateDto(AddTeamMemberDto),
    controller.addMember.bind(controller)
);

/**
 * @swagger
 * /teams/{teamId}/addable-users:
 *   get:
 *     summary: Get users who can be added to the team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 149
 *     responses:
 *       200:
 *         description: List of users who are not members of the team and are not ADMIN users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     example: 5
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                 required:
 *                   - userId
 *                   - email
 *       400:
 *         description: Invalid teamId
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
 *                   example: teamId must be a positive integer
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
 *       403:
 *         description: User does not have permission to view addable users
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
 *                   example: Access denied
 *             examples:
 *               notTeamMember:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               insufficientPermissions:
 *                 summary: MEMBER cannot view addable users
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Team not found
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
    '/:teamId/addable-users',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getAddableUsers.bind(controller)
);

/**
 * @swagger
 * /teams/{teamId}/updatable-members:
 *   get:
 *     summary: Get members whose roles can be updated by the current user
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 74
 *     responses:
 *       200:
 *         description: List of members whose roles can be updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMemberResponse'
 *       400:
 *         description: Invalid teamId
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
 *                   example: teamId must be a positive integer
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
 *       403:
 *         description: User does not have permission to view updatable members
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
 *             examples:
 *               notTeamMember:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               insufficientPermissions:
 *                 summary: MEMBER cannot view updatable members
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *               adminAccess:
 *                 summary: ADMIN cannot access this endpoint
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Team not found
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
    '/:teamId/updatable-members',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getUpdatableMembers.bind(controller)
);

/**
 * @swagger
 * /teams/my-role-updatable-select-list:
 *   get:
 *     summary: Get teams where the current user can update member roles
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams where the current user can update at least one member role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamSelectResponse'
 *             example:
 *               - teamId: 80
 *                 name: Team63
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
 *       403:
 *         description: Forbidden - ADMIN role is not allowed to access this endpoint
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
    '/my-role-updatable-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getMyTeamsForRoleUpdate.bind(controller)
);

/**
 * @swagger
 * /teams/{teamId}/removable-members:
 *   get:
 *     summary: Get members that the current user can remove from a team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: Team ID
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 74
 *     responses:
 *       200:
 *         description: List of removable team members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMemberResponse'
 *             example:
 *               - userId: 5
 *                 email: test@test.com
 *                 role: MEMBER
 *               - userId: 135
 *                 email: test135@test.com
 *                 role: MEMBER
 *               - userId: 136
 *                 email: test136@test.com
 *                 role: MEMBER
 *       400:
 *         description: Invalid teamId
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
 *                   example: teamId must be a positive integer
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
 *       403:
 *         description: User does not have permission to remove members
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
 *                   example: Access denied
 *             examples:
 *               notTeamMember:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               insufficientPermissions:
 *                 summary: User cannot remove members
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *               adminAccess:
 *                 summary: ADMIN cannot access this endpoint
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Team not found
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
    '/:teamId/removable-members',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getRemovableMembers.bind(controller)
);

// =========================
// GET TEAM MEMBERS
// =========================

/**
 * @swagger
 * /teams/{teamId}/members:
 *   get:
 *     summary: Get team members
 *     tags:
 *       - Team Members
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: Team ID
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 74
 *     responses:
 *       200:
 *         description: List of team members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMemberResponse'
 *             example:
 *               - userId: 10
 *                 email: test11@test.com
 *                 role: MANAGER
 *               - userId: 1
 *                 email: test3@test.com
 *                 role: OWNER
 *               - userId: 5
 *                 email: test@test.com
 *                 role: MEMBER
 *               - userId: 7
 *                 email: test8@test.com
 *                 role: MANAGER
 *               - userId: 8
 *                 email: tempadmin8@test.com
 *                 role: MANAGER
 *               - userId: 9
 *                 email: test10@test.com
 *                 role: MANAGER
 *               - userId: 135
 *                 email: test135@test.com
 *                 role: MEMBER
 *               - userId: 136
 *                 email: test136@test.com
 *                 role: MEMBER
 *       400:
 *         description: Invalid teamId
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
 *                   example: teamId must be a positive integer
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
 *                   example: Access denied
 *               required:
 *                 - status
 *                 - message
 *             examples:
 *               accessDenied:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               adminAccess:
 *                 summary: ADMIN role is not allowed
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Team not found
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

router.get(
    '/:teamId/members',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getMembers.bind(controller)
);

// =========================
// UPDATE MEMBER ROLE
// =========================

/**
 * @swagger
 * /teams/{teamId}/members/{userId}/role:
 *   patch:
 *     summary: Update team member role
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: Team ID
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 149
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID of the member
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTeamMemberDto'
 *           example:
 *             role: MANAGER
 *     responses:
 *       200:
 *         description: Role updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role updated
 *             example:
 *               message: Role updated
 *       400:
 *         description: Invalid request data or invalid role change
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
 *               invalidRole:
 *                 summary: Invalid role
 *                 value:
 *                   status: 400
 *                   message: "role must be one of the following values: MANAGER, MEMBER"
 *               ownRole:
 *                 summary: Cannot change own role
 *                 value:
 *                   status: 400
 *                   message: Cannot change your own role
 *       401:
 *         description: Authentication required
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
 *             example:
 *               status: 401
 *               message: No token provided
 *       403:
 *         description: Access denied or insufficient permissions
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
 *             examples:
 *               accessDenied:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               insufficientPermissions:
 *                 summary: User does not have permission to update member roles
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *       404:
 *         description: Team or member not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *             examples:
 *               teamNotFound:
 *                 summary: Team not found
 *                 value:
 *                   status: 404
 *                   message: Team not found
 *               memberNotFound:
 *                 summary: Member not found
 *                 value:
 *                   status: 404
 *                   message: Member not found
 *               memberNotInTeam:
 *                 summary: Member does not exist in this team
 *                 value:
 *                   status: 404
 *                   message: This member does not exist in this team
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

router.patch(
    '/:teamId/members/:userId/role',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    validateDto(UpdateTeamMemberDto),
    controller.updateMemberRole.bind(controller)
);

// =========================
// TRANSFER OWNERSHIP
// =========================


/**
 * @swagger
 * /teams/{teamId}/transfer-ownership/{newOwnerId}:
 *   patch:
 *     summary: Transfer team ownership to another member
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 6
 *       - in: path
 *         name: newOwnerId
 *         required: true
 *         description: ID of the member who will become the owner
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *     responses:
 *       204:
 *         description: Ownership transferred successfully
 *
 *       400:
 *         description: Invalid teamId or newOwnerId, or the target member cannot become OWNER
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
 *               invalidTeamId:
 *                 summary: Invalid teamId
 *                 value:
 *                   status: 400
 *                   message: teamId must be a positive integer
 *               invalidNewOwnerId:
 *                 summary: Invalid newOwnerId
 *                 value:
 *                   status: 400
 *                   message: newOwnerId must be a positive integer
 *               cannotBeOwner:
 *                 summary: Member cannot become OWNER
 *                 value:
 *                   status: 400
 *                   message: This member cannot be OWNER
 *
 *       401:
 *         description: Authentication required
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
 *             example:
 *               status: 401
 *               message: No token provided
 *
 *       403:
 *         description: Access denied or insufficient permissions
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
 *             examples:
 *               accessDenied:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               insufficientPermissions:
 *                 summary: User is not the team owner
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *
 *       404:
 *         description: Team not found or target member is not in the team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *             examples:
 *               teamNotFound:
 *                 summary: Team not found
 *                 value:
 *                   status: 404
 *                   message: Team not found
 *               memberNotInTeam:
 *                 summary: Member is not in the team
 *                 value:
 *                   status: 404
 *                   message: This member is not in team
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

router.patch(
    '/:teamId/transfer-ownership/:newOwnerId',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.transferOwnership.bind(controller)
);

/**
 * @swagger
 * /teams/{teamId}/transfer-ownership-and-leave/{newOwnerId}:
 *   patch:
 *     summary: Transfer ownership and leave team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 6
 *       - in: path
 *         name: newOwnerId
 *         required: true
 *         description: ID of the team member who will become the new owner
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *     responses:
 *       204:
 *         description: Ownership transferred and current owner left the team
 *
 *       400:
 *         description: Invalid teamId or newOwnerId, or the target member cannot become OWNER
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
 *               invalidTeamId:
 *                 summary: Invalid teamId
 *                 value:
 *                   status: 400
 *                   message: teamId must be a positive integer
 *               invalidNewOwnerId:
 *                 summary: Invalid newOwnerId
 *                 value:
 *                   status: 400
 *                   message: newOwnerId must be a positive integer
 *               cannotBeOwner:
 *                 summary: Member cannot become OWNER
 *                 value:
 *                   status: 400
 *                   message: This member cannot be OWNER
 *
 *       401:
 *         description: Authentication required
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
 *             example:
 *               status: 401
 *               message: No token provided
 *
 *       403:
 *         description: Access denied or insufficient permissions
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
 *             examples:
 *               accessDenied:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               insufficientPermissions:
 *                 summary: User is not the team owner
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *
 *       404:
 *         description: Team not found or target member is not in the team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *             examples:
 *               teamNotFound:
 *                 summary: Team not found
 *                 value:
 *                   status: 404
 *                   message: Team not found
 *               memberNotInTeam:
 *                 summary: Member is not in the team
 *                 value:
 *                   status: 404
 *                   message: This member is not in team
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

router.patch(
    '/:teamId/transfer-ownership-and-leave/:newOwnerId',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.transferOwnershipAndLeave.bind(controller)
);

/**
 * @swagger
 * /teams/{teamId}/transferable-members:
 *   get:
 *     summary: Get members eligible for ownership transfer
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 6
 *     responses:
 *       200:
 *         description: List of members eligible to become OWNER
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     example: 15
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: test31@test.com
 *                   role:
 *                     type: string
 *                     enum: [MANAGER, MEMBER]
 *                     example: MANAGER
 *             example:
 *               - userId: 15
 *                 email: test31@test.com
 *                 role: MANAGER
 *               - userId: 16
 *                 email: test32@test.com
 *                 role: MEMBER
 *       400:
 *         description: Invalid teamId
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
 *                   example: teamId must be a positive integer
 *             example:
 *               status: 400
 *               message: teamId must be a positive integer
 *       401:
 *         description: Authentication required
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
 *             example:
 *               status: 401
 *               message: No token provided
 *       403:
 *         description: Access denied or insufficient permissions
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
 *                   example: Access denied
 *             examples:
 *               accessDenied:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               insufficientPermissions:
 *                 summary: User is not the team owner
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Team not found
 *             example:
 *               status: 404
 *               message: Team not found
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

router.get(
    '/:teamId/transferable-members',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getTransferableMembers.bind(controller)
);


/**
 * @swagger
 * /teams/my-transferable-select-list:
 *   get:
 *     summary: Get teams where the current user can transfer ownership
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams where the current user can transfer ownership
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamSelectResponse'
 *             example:
 *               - teamId: 6
 *                 name: Development Team
 *               - teamId: 74
 *                 name: Test Team
 *       401:
 *         description: Authentication required
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
 *             example:
 *               status: 401
 *               message: No token provided
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

router.get(
    '/my-transferable-select-list',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.getMyTeamsForOwnershipTransfer.bind(controller)
);


/**
 * @swagger
 * /teams/{teamId}:
 *   delete:
 *     summary: Remove team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: Positive team ID
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 80
 *     responses:
 *       204:
 *         description: Team removed successfully
 *       400:
 *         description: Invalid teamId
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
 *                   example: teamId must be a positive integer
 *             example:
 *               status: 400
 *               message: teamId must be a positive integer
 *       401:
 *         description: Authentication required
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
 *             example:
 *               status: 401
 *               message: No token provided
 *       403:
 *         description: Access denied or insufficient permissions
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
 *                   example: Access denied
 *             examples:
 *               accessDenied:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               notOwner:
 *                 summary: User is not the team owner
 *                 value:
 *                   status: 403
 *                   message: Only owner can remove team
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Team not found
 *             example:
 *               status: 404
 *               message: Team not found
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

router.delete(
    '/:teamId',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.removeTeam.bind(controller)
);

// =========================
// REMOVE MEMBER
// =========================

/**
 * @swagger
 * /teams/{teamId}/members/{userId}:
 *   delete:
 *     summary: Remove user from team
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Positive team ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Positive user ID
 *     responses:
 *       204:
 *         description: Member removed successfully
 *
 *       400:
 *         description: Invalid parameters or member cannot be removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             examples:
 *               invalidTeamId:
 *                 summary: Invalid teamId
 *                 value:
 *                   status: 400
 *                   message: teamId must be a positive integer
 *               invalidUserId:
 *                 summary: Invalid userId
 *                 value:
 *                   status: 400
 *                   message: userId must be a positive integer
 *               noMembersAvailable:
 *                 summary: No members available to remove
 *                 value:
 *                   status: 400
 *                   message: No members available to remove
 *               cannotRemoveYourself:
 *                 summary: Cannot remove yourself
 *                 value:
 *                   status: 400
 *                   message: Cannot remove yourself
 *               cannotRemoveOwner:
 *                 summary: Cannot remove owner
 *                 value:
 *                   status: 400
 *                   message: Cannot remove owner
 *               managerCannotRemoveManager:
 *                 summary: Manager cannot remove another manager
 *                 value:
 *                   status: 400
 *                   message: Manager cannot remove another manager
 *
 *       401:
 *         description: Authentication required
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
 *             example:
 *               status: 401
 *               message: No token provided
 *
 *       403:
 *         description: Access denied or insufficient permissions
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
 *             examples:
 *               notMember:
 *                 summary: User is not a member of the team
 *                 value:
 *                   status: 403
 *                   message: Access denied
 *               insufficientPermissions:
 *                 summary: User does not have permission to remove members
 *                 value:
 *                   status: 403
 *                   message: Insufficient permissions
 *
 *       404:
 *         description: Team, user, or team member not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             examples:
 *               teamNotFound:
 *                 summary: Team not found
 *                 value:
 *                   status: 404
 *                   message: Team not found
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   status: 404
 *                   message: User not found
 *               memberNotFound:
 *                 summary: Member not found
 *                 value:
 *                   status: 404
 *                   message: Member not found
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

router.delete(
    '/:teamId/members/:userId',
    authMiddleware,
    rolesMiddleware(UserRole.USER),
    controller.removeMember.bind(controller)
);

export default router;