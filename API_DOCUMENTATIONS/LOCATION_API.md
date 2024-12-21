# API Documentation

## Location Endpoints

### Get All Locations

**URL:** `/location`

**Method:** `GET`

**Response:**
```json
[
  {
    "_id": "676715532c37afc1da65ef83",
    "name": "new location",
    "state": "Ready",
    "entityId": "676715472c37afc1da65ef7e",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:21:55.646Z",
    "updatedAt": "2024-12-21T19:21:55.646Z",
    "__v": 0,
    "entity": "entity 1",
    "inWorkOrder": 1
  }
]
```

---

### Add New Location

**URL:** `/location`

**Method:** `POST`

**Payload:**
```json
{
  "name": "location 2",
  "entityId": "6767175c2c37afc1da65ef94"
}
```

**Response:**
```json
{
  "message": "Location added successfully.",
  "location": {
    "_id": "67671a242c37afc1da65ef9c",
    "name": "location 2",
    "state": "Ready",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:42:28.478Z",
    "updatedAt": "2024-12-21T19:42:28.478Z",
    "__v": 0,
    "entity": "dadsads"
  }
}
```

---

## Work Order Endpoints

### Get Locations for a Work Order

**URL:** `/work-order/locations?workOrderId=<workOrderId>`

**Method:** `GET`

**Response:**
```json
[
  {
    "_id": "676715602c37afc1da65ef8f",
    "workOrderId": "676715232c37afc1da65ef78",
    "locationId": "676715532c37afc1da65ef83",
    "userId": "67643904dec70c21d0748ca3",
    "rate": 1,
    "quantity": 1,
    "state": "Ready",
    "billed": false,
    "isDeleted": false,
    "createdAt": "2024-12-21T19:22:08.416Z",
    "updatedAt": "2024-12-21T19:22:08.416Z",
    "__v": 0,
    "location": "new location",
    "entity": "entity 1",
    "saved": true
  }
]
```

---

## Location Management Endpoints

### Mark Location as Completed

**URL:** `/location/markAsCompleted`

**Method:** `PUT`

**Payload:**
```json
{
  "locationId": "676715532c37afc1da65ef83",
  "contractorId": "676711a42c37afc1da65ef6f"
}
```

**Response:**
```json
{
  "message": "Status updated successfully"
}
```

