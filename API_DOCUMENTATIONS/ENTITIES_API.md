# API Documentation

## Entities API

### Get Entities

`GET https://woms-jw8r.onrender.com/entity`

**Description:**  
Fetches a list of entities available.

**Response:**

- **Body:**

```json
[
  {
    "_id": "676715472c37afc1da65ef7e",
    "name": "entity 1",
    "userId": "67643904dec70c21d0748ca3",
    "locationCount": 1,
    "createdAt": "2024-12-21T19:21:43.652Z",
    "updatedAt": "2024-12-21T19:21:55.418Z",
    "__v": 0
  }
]
```

#### Endpoint: `GET /entity`

#### Request:

- **Method**: GET

#### Response:

```json
[
  {
    "_id": "676715472c37afc1da65ef7e",
    "name": "entity 1",
    "userId": "67643904dec70c21d0748ca3",
    "locationCount": 1,
    "createdAt": "2024-12-21T19:21:43.652Z",
    "updatedAt": "2024-12-21T19:21:55.418Z",
    "__v": 0
  }
]
```

### Create Entity

Create a new entity in the system.

**HTTP Method:** POST

**Endpoint:** `/entity`

**Request Body:**

```json
{
  "name": "dadsads"
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| name      | string | Yes      | Name of the entity |

**Response:**

```json
{
  "message": "Entity added successfully.",
  "entity": {
    "name": "dadsads",
    "userId": "67643904dec70c21d0748ca3",
    "locationCount": 0,
    "_id": "6767175c2c37afc1da65ef94",
    "createdAt": "2024-12-21T19:30:36.900Z",
    "updatedAt": "2024-12-21T19:30:36.900Z",
    "__v": 0
  }
}
```

### Search Entities

Search for entities by name.

**HTTP Method:** GET

**Endpoint:** `/entity/search`

**Query Parameters:**

| Parameter  | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| searchTerm | string | Yes      | Search term to filter entities |

**Response:**

```json
[
  {
    "_id": "6767175c2c37afc1da65ef94",
    "name": "dadsads",
    "userId": "67643904dec70c21d0748ca3",
    "locationCount": 0,
    "createdAt": "2024-12-21T19:30:36.900Z",
    "updatedAt": "2024-12-21T19:30:36.900Z",
    "__v": 0
  }
]
```
