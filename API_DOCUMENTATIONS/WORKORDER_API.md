# API Documentation

## Endpoints

### 1. Add Work Order
**URL:** `https://woms-jw8r.onrender.com/work-order`

**Method:** `POST`

**Request Body:**
```json
{
  "contractorId": "67671bfb2c37afc1da65efb0",
  "paymentTerms": 1,
  "dueDate": "2026-01-01"
}
```

**Response:**
```json
{
  "message": "Work order saved successfully.",
  "workOrder": {
    "_id": "67671c182c37afc1da65efb5",
    "paymentTerms": 1,
    "dueDate": "2026-01-01T00:00:00.000Z",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:50:48.680Z",
    "updatedAt": "2024-12-21T19:50:48.680Z",
    "__v": 0,
    "contractor": "contractor 1"
  }
}
```

---

### 2. Get All Work Orders
**URL:** `https://woms-jw8r.onrender.com/work-order`

**Method:** `GET`

**Response:**
```json
[
  {
    "_id": "676715232c37afc1da65ef78",
    "paymentTerms": 2,
    "dueDate": "2026-01-01T00:00:00.000Z",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:21:07.895Z",
    "updatedAt": "2024-12-21T19:21:07.895Z",
    "__v": 0,
    "contractor": "mastek"
  },
  {
    "_id": "67671c182c37afc1da65efb5",
    "paymentTerms": 1,
    "dueDate": "2026-01-01T00:00:00.000Z",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:50:48.680Z",
    "updatedAt": "2024-12-21T19:50:48.680Z",
    "__v": 0,
    "contractor": "contractor 1"
  }
]
```

---

### 3. Add Location to Work Order
**URL:** `https://woms-jw8r.onrender.com/work-order/location`

**Method:** `POST`

**Request Body:**
```json
{
  "entity": "dadsads",
  "location": "location 2",
  "quantity": 2,
  "rate": 2,
  "_id": "67671a242c37afc1da65ef9c",
  "workOrderId": "67671c182c37afc1da65efb5"
}
```

**Response:**
```json
{
  "contractorId": "67671bfb2c37afc1da65efb0",
  "workOrderId": "67671c182c37afc1da65efb5",
  "locationId": "67671a242c37afc1da65ef9c",
  "userId": "67643904dec70c21d0748ca3",
  "rate": 2,
  "quantity": 2,
  "state": "Ready",
  "billed": false,
  "isDeleted": false,
  "_id": "67671c762c37afc1da65efc1",
  "createdAt": "2024-12-21T19:52:22.725Z",
  "updatedAt": "2024-12-21T19:52:22.725Z",
  "__v": 0
}
```

