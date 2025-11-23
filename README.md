# Backend Local Server

This document provides instructions on how to run the local development server and examples for interacting with the API endpoints.

## Running the Local Server

To start the local development server, navigate to the `backend/` directory and run the following command:

```bash
npm run dev
```

The server will be accessible at `http://localhost:3000`.

## API Endpoints

The local server serves files from the `backend/api/` directory. You can test the endpoints using `curl`.

### `flowise.js`

Example `curl` command for `flowise.js`:

```bash
curl -X GET http://localhost:3000/api/flowise.js
```

### `worker.js`

Example `curl` command for `worker.js`:

```bash
curl -X GET http://localhost:3000/api/worker.js
```