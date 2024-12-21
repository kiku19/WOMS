# API Documentation

## Endpoints

### 1. Generate Bill
**URL:** `https://woms-jw8r.onrender.com/bill/`

**Method:** `POST`

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "message": "Bill generated successfully"
}
```

---

### 2. Get All Bills
**URL:** `https://woms-jw8r.onrender.com/bill`

**Method:** `GET`

**Response:**
```json
[
  {
    "_id": "67671a8ff25cece42e009504",
    "userId": "67643904dec70c21d0748ca3",
    "__v": 0,
    "totalAmount": 1,
    "billNo": 1,
    "billedAt": "2024-12-21T19:54:34.358Z",
    "billingProcessId": "67671cfa2c37afc1da65efcd",
    "contractor": "mastek"
  },
  {
    "_id": "67671cdbf25cece42e009625",
    "userId": "67643904dec70c21d0748ca3",
    "__v": 0,
    "totalAmount": 4,
    "billNo": 2,
    "billedAt": "2024-12-21T19:54:34.358Z",
    "billingProcessId": "67671cfa2c37afc1da65efcd",
    "contractor": "contractor 1"
  }
]
```

