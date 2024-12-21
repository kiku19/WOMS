# API Documentation

## Contractors API

### Get Contractors

**Endpoint:**
`GET /contractors`

**Description:**
Fetches a list of contractors.

**Response:**

```json
[
  {
    "_id": "676711a42c37afc1da65ef6f",
    "name": "mastek",
    "phone": "1111111111",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:06:12.365Z",
    "updatedAt": "2024-12-21T19:06:12.365Z",
    "__v": 0
  }
]
```

### Add Contractor

**Endpoint:**
`POST /contractors`

**Description:**
Adds a new contractor.

**Request Body:**

```json
{
  "name": "mastek",
  "phone": "1111111111"
}
```

**Response:**

```json
{
  "message": "Contractor added successfully.",
  "contractor": {
    "name": "mastek",
    "phone": "1111111111",
    "userId": "67643904dec70c21d0748ca3",
    "_id": "676711a42c37afc1da65ef6f",
    "createdAt": "2024-12-21T19:06:12.365Z",
    "updatedAt": "2024-12-21T19:06:12.365Z",
    "__v": 0
  }
}
```

### Search Contractors

**Endpoint:**
`GET /contractors/search?searchTerm={searchTerm}`

**Description:**
Searches for contractors based on the provided search term.

**Response:**

```json
[
  {
    "_id": "676711a42c37afc1da65ef6f",
    "name": "mastek",
    "phone": "1111111111",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:06:12.365Z",
    "updatedAt": "2024-12-21T19:06:12.365Z",
    "__v": 0
  }
]
```

### Search Contractors with Location

**Endpoint:**
`GET /contractors/searchWithLocation?searchTerm={searchTerm}&locationId={locationId}`

**Description:**
Searches for contractors based on the provided search term and location ID.

**Response:**

```json
[
  {
    "_id": "676711a42c37afc1da65ef6f",
    "name": "mastek",
    "phone": "1111111111",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:06:12.365Z",
    "updatedAt": "2024-12-21T19:06:12.365Z",
    "__v": 0
  }
]
```



