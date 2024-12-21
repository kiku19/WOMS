# WOMS

## Work Order Management System Starter Guide

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   ng serve
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the environment directory:
   ```bash
   mkdir backend/env
   ```
4. Create the local environment file:
   ```bash
   touch backend/env/.env.local
   ```

#### Backend Environment File Configuration

Add the following variables to `backend/env/.env.local`:

```env
ENV=LOCAL
MONGODB_URL=<YOUR_MONGODB_URI>/<YOUR_DB_NAME>
PORT=4000
JWT_SECRET=<YOUR_SECRET_KEY>
JWT_EXPIRATION=1h
```

Replace `<YOUR_MONGODB_URI>`,`<YOUR_DB_NAME>` and `<YOUR_SECRET_KEY>` with the appropriate values.

5. Start the backend server:
   ```bash
   npm start
   ```

