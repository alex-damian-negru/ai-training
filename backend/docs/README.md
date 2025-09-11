# Backend Setup

This backend is a Node.js/Express application using TypeScript and Prisma with a SQLite database.

## Prerequisites

- Node.js (check root `package.json` for engine requirements if specified)
- npm

## Initial Setup

1.  Install dependencies from the root directory: `npm install`
2.  Navigate to the project root.
3.  Create the initial SQLite database and apply the schema: `npm run db:migrate:dev -w backend`
    *   This will create a `dev.db` file in the `backend` directory (which is gitignored).
4.  Ensure you have a `.env` file in the `backend` directory (see `.env.example` if one exists, or create it based on `backend/.env` contents described during setup).

## Running the Application

-   **Development:** Run `npm run dev` from the *root* directory. This uses `concurrently` to start both backend (with `nodemon`) and frontend dev servers.
-   **Production:**
    1.  Build the backend: `npm run build -w backend`
    2.  Start the backend: `npm run start -w backend`

## Example API Implementation

The backend includes a complete task management API demonstrating best practices:

- RESTful endpoints at `/api/exercises/tasks`
- Full CRUD operations with validation and error handling
- Prisma-based data modeling and repository patterns
- TypeScript integration with type-safe database operations

See `documentation/reference/TASKS.md` for complete API documentation including database schema, endpoint specifications, and implementation patterns. 