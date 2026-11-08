# TeamFlow

TeamFlow is a full-stack web application for managing teams, team members, roles, and ownership.

The project consists of a React + TypeScript frontend and a Node.js + TypeScript backend with a REST API.

## Production Deployment

TeamFlow is deployed and available online.

- **Frontend:** https://vivacious-passion-production-6744.up.railway.app
- **Backend API:** https://teamflow-production-b1ad.up.railway.app
- **API Documentation (Swagger):** https://teamflow-production-b1ad.up.railway.app/api-docs

The frontend and backend are hosted on Railway.
The production MySQL database is hosted on Aiven.

## Project Structure

```text
teamflow/
├── teamflow-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── entities/
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   └── swagger/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── team/
│   │   │   │   └── dto/
│   │   │   └── user/
│   │   │       └── dto/
│   │   ├── shared/
│   │   │   └── errors/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── Teamflow API.postman_collection.json
│   └── tsconfig.json
│
└── teamflow-frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── assets/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── App.css
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── .env.example
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express
- TypeORM
- MySQL
- JWT
- Swagger
- class-validator
- class-transformer

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Bootstrap

## Main Features

- User registration and login
- JWT-based authentication
- Role-based authorization
- Team creation and management
- Adding members to teams
- Removing members from teams
- Team member role management
- Ownership transfer
- Pagination
- Request validation
- Centralized error handling
- REST API documentation with Swagger

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anatol0303/teamflow.git
cd teamflow
```

### 2. Install backend dependencies

```bash
cd teamflow-backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../teamflow-frontend
npm install
```
## Environment Variables

The application uses environment variables to configure the backend server, database connection, frontend API URL, and JWT authentication.

### Backend

Create a `.env` file in the `teamflow-backend` directory:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=teamflow

JWT_SECRET=your_secret
JWT_EXPIRES_IN=your_expiration
```

### Frontend

Create a `.env` file in the `teamflow-frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```
### Production Environment

In production, environment variables are configured directly in Railway.

The backend uses the production MySQL database hosted on Aiven.

Production environment variables include the database connection settings, JWT_SECRET, NODE_ENV, and FRONTEND_URL.

The frontend uses VITE_API_URL to connect to the deployed backend API.

Do not commit .env files or sensitive credentials to the repository.

## Database Setup

### Local Database

Create a MySQL database named `teamflow`:

```sql
CREATE DATABASE teamflow;
```

Make sure the database credentials in `teamflow-backend/.env` match your local MySQL configuration.

### Production Database

The production MySQL database is hosted on Aiven.

The database schema is synchronized automatically by TypeORM when the backend starts.

## Run the Project Locally

### Start the backend

Open a terminal in the `teamflow-backend` directory:

```bash
npm run dev
```

The backend server will start on:

```text
http://localhost:3000
```

### Start the frontend

Open a second terminal in the `teamflow-frontend` directory:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

Open the frontend URL in your browser to use TeamFlow.

## API Documentation

The backend API is documented with Swagger.

### Local Environment

After starting the backend server, Swagger UI is available at:

```text
http://localhost:3000/api-docs
```
### Production Environment

The deployed API documentation is available at:

```text
https://teamflow-production-b1ad.up.railway.app/api-docs
```

Open either URL in your browser to view and test the available API endpoints.

## API Endpoints

### Users

- `POST /users/createUser` — Register a new user
- `POST /users/createAdmin` — Create an administrator
- `POST /users/login` — User login
- `GET /users/admin-select-list` — Get users available for admin selection
- `GET /users/admin-select-list-admins` — Get administrators for selection
- `GET /users/admin-select-list-admins-without-token` — Check whether any administrators exist
- `GET /users/make-admin-select-list` — Get users available for promotion to administrator
- `GET /users/remove-admin-select-list` — Get administrators available for removal of administrator role
- `PATCH /users/:userId/make-admin` — Promote a user to administrator
- `DELETE /users/:userId/remove-admin` — Remove administrator role from a user
- `DELETE /users/self-remove-admin` — Remove own administrator role
- `DELETE /users/self-remove-user` — Delete the current user's account
- `PATCH /users/change-email` — Change email address
- `PATCH /users/change-password` — Change password

### Teams

- `GET /teams/admin-select-list` — Get teams available for admin selection
- `POST /teams/` — Create a team
- `GET /teams/my-renameable-select-list` — Get teams available for renaming
- `PATCH /teams/:teamId/rename` — Rename a team
- `GET /teams/my` — Get all teams the current user belongs to
- `GET /teams/my-owned` — Get teams owned by the current user
- `GET /teams/my-manageable` — Get teams the current user can manage
- `GET /teams/my-member` — Get teams where the current user is a member
- `GET /teams/my-select-list` — Get the current user's teams for selection
- `GET /teams/my-manageable-select-list` — Get manageable teams for selection
- `GET /teams/my-owned-select-list` — Get owned teams for selection
- `GET /teams/my-removable-select-list` — Get teams available for member removal
- `POST /teams/:teamId/members` — Add a member to a team
- `GET /teams/:teamId/addable-users` — Get users available to add to a team
- `GET /teams/:teamId/updatable-members` — Get members whose roles can be updated
- `GET /teams/my-role-updatable-select-list` — Get teams available for member role updates
- `GET /teams/:teamId/removable-members` — Get members available for removal
- `GET /teams/:teamId/members` — Get team members
- `PATCH /teams/:teamId/members/:userId/role` — Update a team member's role
- `PATCH /teams/:teamId/transfer-ownership/:newOwnerId` — Transfer team ownership
- `PATCH /teams/:teamId/transfer-ownership-and-leave/:newOwnerId` — Transfer ownership and leave the team
- `GET /teams/:teamId/transferable-members` — Get members available for ownership transfer
- `GET /teams/my-transferable-select-list` — Get teams available for ownership transfer
- `DELETE /teams/:teamId` — Delete a team
- `DELETE /teams/:teamId/members/:userId` — Remove a member from a team

## Authentication & Authorization

- TeamFlow uses JWT-based authentication to secure protected API endpoints.

### Authentication

- Users log in with their email and password.
- After successful login, the server returns a JWT token.
- The token is used to authenticate requests to protected API endpoints.
- The frontend stores the token in localStorage and sends it in the Authorization header.

### Roles

The application supports two user roles:

- `USER` — a regular user with access to team-related operations.
- `ADMIN` — administrator with additional user and team management permissions.

Role-based authorization is implemented using middleware.

## Project Architecture

### Backend

The backend follows a modular architecture.

- `modules/user` — user registration, authentication, and user management.
- `modules/team` — team and team member management.
- `entities` — TypeORM entities representing users, teams, and team members.
- `middlewares` — authentication, authorization, validation, and error handling.
- `infrastructure/database` — database configuration and connection.
- `infrastructure/swagger` — Swagger configuration and API documentation.
- `shared/errors` — custom application errors and HTTP error classes.
- `types` — custom TypeScript type declarations.
- `config` — application configuration.

### Frontend

The frontend is built with React and TypeScript.

- `pages` — application pages.
- `components` — reusable UI components.
- `hooks` — custom React hooks.
- `api` — API client and HTTP requests.
- `assets` — static frontend assets.

## Testing

The backend API has been manually tested using Postman.

Swagger UI can also be used to explore and test the available API endpoints.

The frontend has been tested locally by verifying the main user flows, including authentication and navigation.

The production deployment has been verified: the frontend is accessible online, and the backend successfully connects to the production MySQL database hosted on Aiven.

### AI-Assisted Development

AI tools were used as development assistants throughout the project for:

- Exploring implementation approaches and architectural decisions.
- Troubleshooting and debugging.
- Reviewing code and improving documentation.

All suggested solutions were reviewed, tested, and integrated into the project with a focus on understanding the implementation and its behavior.