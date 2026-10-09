# Leadspace — Leads Tracking App

A small lead-management portal and REST API built with React, Express, and MongoDB. It supports lead CRUD, searchable and filterable leads, and multiple timestamped notes per lead.

## Requirements

- Node.js 20 or newer and npm
- MongoDB 6 or newer running locally or a MongoDB connection URI

## Run locally

1. Start MongoDB locally and install the frontend and backend dependencies:

   ```sh
   cd frontend
   npm install
   npm run build
   cd backend
   npm install
   ```

2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` to your MongoDB instance. The example uses a local database at `mongodb://127.0.0.1:27017/leads_tracking`.

3. For development, start both servers in separate terminals:

   ```sh
   npm run dev
   ```

   ```sh
   cd frontend
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173). Vite serves the React app and forwards API calls to the backend at port 3000. To insert sample leads, run this in another terminal:

   ```sh
   cd backend
   npm run seed
   ```

The server reports a startup error and exits if MongoDB cannot be reached; start MongoDB before the app.

## Web portal

- `/leads` — searchable, filterable, paginated leads list
- `/leads/new` — create a lead
- `/leads/:id` — lead details and notes
- `/leads/:id/edit` — update a lead

Deleting a lead also removes its notes.

## API

All API responses use JSON. Validation errors return `400`, missing leads return `404`, and created resources return `201`.

### List, search, and filter

```sh
curl 'http://localhost:3000/api/leads?search=alex&status=new&page=1&limit=10'
```

Returns `{ "leads": [...], "pagination": { "page": 1, "limit": 10, "total": 0, "pages": 0 } }`. Search matches name or email (case-insensitive). Status can be `new`, `contacted`, `qualified`, or `lost`; the maximum page size is 50.

### Create a lead

```sh
curl -X POST http://localhost:3000/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alex Rivera","email":"alex@example.com","phone":"+1 555 0100","status":"new"}'
```

### Read, update, or delete a lead

```sh
curl http://localhost:3000/api/leads/LEAD_ID

curl -X PATCH http://localhost:3000/api/leads/LEAD_ID \
  -H 'Content-Type: application/json' \
  -d '{"status":"contacted"}'

curl -X DELETE http://localhost:3000/api/leads/LEAD_ID
```

`GET /api/leads/:id` includes the lead and its notes. `DELETE` returns `204 No Content`.

### List and add notes

```sh
curl http://localhost:3000/api/leads/LEAD_ID/notes

curl -X POST http://localhost:3000/api/leads/LEAD_ID/notes \
  -H 'Content-Type: application/json' \
  -d '{"content":"Sent an introductory email."}'
```

## Project structure

```text
backend/
  package.json
  server.js
  src/
    config/        MongoDB connection
    constants/     Shared lead statuses
    controllers/   API and web request handlers
    middleware/    Not-found and error responses
    models/        Mongoose Lead and Note models
    routes/        API and web route definitions
    scripts/       Database seed script
    utils/         Validation and HTTP error helpers
    app.js         Express application
    server.js      Environment loading and startup
  tests/           Node.js built-in test suite
frontend/
package.json     Frontend dependencies and commands
package-lock.json Locked frontend dependencies
src/             React pages and reusable components
public/          Static assets
dist/            Production build served by Express
index.html       Vite entry point
vite.config.js   Frontend development and build configuration
```

Build the frontend with `npm run build` from `frontend/`; Express serves the generated app from `frontend/dist` alongside the API. Run backend tests from the `backend/` directory with `npm test`.
