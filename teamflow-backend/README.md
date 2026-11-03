# TeamFlow Backend

REST API for managing teams, members, and roles using Node.js, TypeScript, Express, and MySQL.

## Stack

- Node.js
- TypeScript
- Express
- TypeORM
- MySQL
- JWT Authentication

## Features

- JWT-based authentication
- Team creation and management
- Team member roles (OWNER / MANAGER / MEMBER)
- Ownership transfer
- Pagination and filtering
- Centralized error handling
- Request validation
- TypeORM relations and transactions

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anatol0303/teamflow-backend.git
cd teamflow-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Copy `.env.example` to `.env` and update the values.

### 4. Create MySQL database

Create a database named:

```sql
CREATE DATABASE teamflow;
```

### 5. Run the project

Development mode:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

## Project Structure

```text
src/
├── config/
├── entities/
├── infrastructure/
├── middlewares/
├── modules/
│   ├── user/
│   └── team/
├── shared/
└── types/
```

## Environment Variables

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=teamflow
JWT_SECRET=your_secret
```

## API Endpoints

### Users

- POST /users/
- POST /users/login
- POST /users/admin-create
- GET /users/

### Teams

- POST /teams
- GET /teams/my
- POST /teams/:teamId/members
- GET /teams/:teamId/members
- PATCH /teams/:teamId/members/:userId
- PATCH /teams/:teamId/transfer-ownership/:newOwnerId
- DELETE /teams/:teamId/members/:userId

## Authorization

Protected endpoints require JWT token.

```http
Authorization: Bearer YOUR_TOKEN
```

Roles:

- OWNER
- MANAGER
- MEMBER



## API Documentation

After starting the server, Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

## Current Status

- All endpoints are implemented.
- API is documented with Swagger.
- Endpoints have been manually tested using Postman.