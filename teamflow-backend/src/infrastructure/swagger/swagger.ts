import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'TeamFlow API',
            version: '1.0.0',
            description: 'API documentation for TeamFlow project',
        },

        servers: [
            {
                url: process.env.RAILWAY_PUBLIC_DOMAIN
                    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
                    : `http://localhost:${process.env.PORT || 3000}`,
            },
        ],

        // 🔐 JWT AUTH
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },

            // 📦 SCHEMAS (DTO)
            schemas: {

                CreateTeamDto: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Backend Team',
                        },
                    },
                },
                RenameTeamDto: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 100,
                            example: 'New Team Name',
                        },
                    },
                },

                AddTeamMemberDto: {
                    type: 'object',
                    required: ['userId', 'role'],
                    properties: {
                        userId: {
                            type: 'integer',
                            example: 2,
                        },
                        role: {
                            type: 'string',
                            enum: ['MANAGER', 'MEMBER'],
                            example: 'MEMBER',
                        },
                    },
                },

                UpdateTeamMemberDto: {
                    type: 'object',
                    required: ['role'],
                    properties: {
                        role: {
                            type: 'string',
                            enum: ['MANAGER', 'MEMBER'],
                            example: 'MANAGER',
                        },
                    },
                },
                TeamResponse: {
                    type: 'object',
                    properties: {
                        teamId: {
                            type: 'integer',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            example: 'Backend Team',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T12:00:00.000Z',
                        },
                    },
                },

                UserTeamResponse: {
                    type: 'object',
                    properties: {
                        teamId: {
                            type: 'integer',
                            example: 159,
                        },
                        name: {
                            type: 'string',
                            example: 'Team154',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-10-07T09:47:46.815Z',
                        },
                        role: {
                            type: 'string',
                            enum: ['OWNER', 'MANAGER', 'MEMBER'],
                            example: 'OWNER',
                        },
                    },
                },
                UserTeamsResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/UserTeamResponse',
                            },
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'integer',
                                    example: 38,
                                },
                                page: {
                                    type: 'integer',
                                    example: 1,
                                },
                                limit: {
                                    type: 'integer',
                                    example: 10,
                                },
                            },
                        },
                    },
                },
                OwnedTeamResponse: {
                    type: 'object',
                    properties: {
                        teamId: {
                            type: 'integer',
                            example: 161,
                        },
                        name: {
                            type: 'string',
                            example: 'team16',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-10-07T17:29:00.363Z',
                        },
                    },
                },

                OwnedTeamsResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/OwnedTeamResponse',
                            },
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'integer',
                                    example: 2,
                                },
                                page: {
                                    type: 'integer',
                                    example: 1,
                                },
                                limit: {
                                    type: 'integer',
                                    example: 10,
                                },
                            },
                        },
                    },
                },
                ManagedTeamResponse: {
                    type: 'object',
                    properties: {
                        teamId: {
                            type: 'integer',
                            example: 111,
                        },
                        name: {
                            type: 'string',
                            example: 'Team86',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-07-19T10:55:44.507Z',
                        },
                    },
                },

                ManagedTeamsResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/ManagedTeamResponse',
                            },
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'integer',
                                    example: 15,
                                },
                                page: {
                                    type: 'integer',
                                    example: 1,
                                },
                                limit: {
                                    type: 'integer',
                                    example: 10,
                                },
                            },
                        },
                    },
                },
                MemberTeamResponse: {
                    type: 'object',
                    properties: {
                        teamId: {
                            type: 'integer',
                            example: 143,
                        },
                        name: {
                            type: 'string',
                            example: 'Team129',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-08-13T15:48:02.127Z',
                        },
                    },
                },

                MemberTeamsResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/MemberTeamResponse',
                            },
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'integer',
                                    example: 4,
                                },
                                page: {
                                    type: 'integer',
                                    example: 1,
                                },
                                limit: {
                                    type: 'integer',
                                    example: 10,
                                },
                            },
                        },
                    },
                },

                CreateUserDto:{
                    type: 'object',
                    required: ['email', 'password'],
                    properties:{
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'test@test.com',
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            example: '123456',
                        },
                    },
                },
                AdminCreateUserDto:{
                    type: 'object',
                    required: ['email', 'password','role'],
                    properties:{
                        email: {
                            type:'string',
                            example: 'admin@test.com',
                        },
                        password:{
                            type:'string',
                            example:'123456',
                        },
                        role: {
                            type: 'string',
                            enum: ['ADMIN', 'USER'],
                            example: 'USER',
                        },
                    },
                },

                MakeAdminResponseDto: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 163,
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'test163@test.com',
                        },
                        role: {
                            type: 'string',
                            enum: ['USER', 'ADMIN'],
                            example: 'ADMIN',
                        },
                    },
                    required: ['id', 'email', 'role'],
                },
                LoginDto:{
                    type: 'object',
                    required: ['email', 'password'],
                    properties:{
                        email: {
                            type:'string',
                            example: 'test@test.com',
                        },
                        password:{
                            type:'string',
                            example:'123456',
                        },
                    },
                },
                ChangeEmailDto: {
                    type: 'object',
                    required: ['newEmail'],
                    properties: {
                        newEmail: {
                            type: 'string',
                            format: 'email',
                            example: 'newemail@test.com',
                        },
                    },
                },
                ChangePasswordDto: {
                    type: 'object',
                    required: ['currentPassword', 'newPassword'],
                    properties: {
                        currentPassword: {
                            type: 'string',
                            example: 'oldpass123',
                        },
                        newPassword: {
                            type: 'string',
                            minLength: 6,
                            example: 'newpass123',
                        },
                    },
                },
                UserResponseDto:{
                    type: 'object',
                    properties:{
                        id:{type:'integer',
                            example:1
                        },
                        email: {
                            type:'string',
                            example: 'test@test.com',
                        },
                        createdAt:{
                            type:'string',
                            example:'2025-01-01T12:00:00.000Z',
                        },
                    },
                },
                LoginResponse:{
                    type: 'object',
                    properties:{
                        token: {
                            type:'string',
                            example: 'jwt.token.here',
                        },

                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Invalid credentials',
                        },
                        statusCode: {
                            type: 'integer',
                            example: 401,
                        },
                    },
                },
                TeamMemberResponse: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'integer',
                            example: 2,
                        },
                        email: {
                            type: 'string',
                            example: 'test@test.com',
                        },
                        role: {
                            type: 'string',
                            enum: ['OWNER', 'MANAGER', 'MEMBER'],
                            example: 'MEMBER',
                        },
                    },
                    required: ['userId', 'email', 'role'],
                },
                TeamSelectResponse: {
                    type: 'object',
                    properties: {
                        teamId: {
                            type: 'integer',
                            example: 80,
                        },
                        name: {
                            type: 'string',
                            example: 'Team63',
                        },
                    },
                    required: ['teamId', 'name'],
                },

            },
            responses: {
                BadRequest: {
                    description: 'Bad Request',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                        },
                    },
                },

                Unauthorized: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                        },
                    },
                },

                Forbidden: {
                    description: 'Forbidden',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                        },
                    },
                },
            },




        },

        // 🔐 ГЛОБАЛЬНОЕ ТРЕБОВАНИЕ AUTH
        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    // 📁 где искать swagger-комментарии
    apis: ['src/modules/**/*.ts'],
});