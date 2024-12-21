# WOMS

## Work Order Management System Starter Guide

### Frontend Setup

1. Install dependencies:
   ```bash
   npm --prefix frontend install
   ```
2. Start the frontend server:
   ```bash
   npm --prefix frontend/ start
   ```

### Backend Setup

1. Install dependencies:
   ```bash
   npm --prefix backend install
   ```

2. Create the local environment file:
   ```bash
   mkdir -p backend/env && touch backend/env/.env.local
   ```

#### Backend Environment File Configuration

3. Add the following variables to `backend/env/.env.local`:

```env
ENV=LOCAL
MONGODB_URL=<YOUR_MONGODB_URI>
PORT=4000
JWT_SECRET=<YOUR_SECRET_KEY>
JWT_EXPIRATION=1h
```

Replace `<YOUR_MONGODB_URI>` and `<YOUR_SECRET_KEY>` with the appropriate values.

4. Start the backend server:
   ```bash
   npm --prefix backend/ start
   ```
