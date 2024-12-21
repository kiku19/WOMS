
# API Documentation

## GET /contractors

### Description:
This endpoint retrieves a list of contractors. Each contractor includes details such as name, phone, user ID, and timestamps for creation and updates.

### Response:

The response is a JSON array containing contractor objects. Each contractor object includes the following fields:

- **_id**: `string`  
  Unique identifier for the contractor.
  
- **name**: `string`  
  Name of the contractor.
  
- **phone**: `string`  
  Phone number of the contractor.
  
- **userId**: `string`  
  The user ID associated with the contractor.
  
- **createdAt**: `string`  
  The date and time when the contractor record was created (ISO 8601 format).
  
- **updatedAt**: `string`  
  The date and time when the contractor record was last updated (ISO 8601 format).
  
- **__v**: `integer`  
  Version key used by MongoDB for internal management.

### Example Response:

```json
[
  {
    "_id": "676711a42c37afc1da65ef6f",
    "name": "string",
    "phone": "1111111111",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:06:12.365Z",
    "updatedAt": "2024-12-21T19:06:12.365Z",
    "__v": 0
  }
]
```





## POST /contractors

### Description:
This endpoint allows you to add a new contractor. The contractor's information, such as name and phone, is passed in the request body.

### Request Body:

- **name**: `string` (Required)  
  Name of the contractor.
  
- **phone**: `string` (Required)  
  Phone number of the contractor.

#### Example Request Body:

```json
{
  "name": "mastek",
  "phone": "1111111111"
}
```

### Response:

On successful creation, the response will contain a message confirming the addition and the details of the newly created contractor.

- **message**: `string`  
  Confirmation message indicating that the contractor was added successfully.
  
- **contractor**: `object`  
  The contractor object containing the following fields:
  - **_id**: `string`  
    Unique identifier for the contractor.
  - **name**: `string`  
    Name of the contractor.
  - **phone**: `string`  
    Phone number of the contractor.
  - **userId**: `string`  
    The user ID associated with the contractor.
  - **createdAt**: `string`  
    The date and time when the contractor record was created (ISO 8601 format).
  - **updatedAt**: `string`  
    The date and time when the contractor record was last updated (ISO 8601 format).
  - **__v**: `integer`  
    Version key used by MongoDB for internal management.

#### Example Response:

```json
{
  "message": "Contractor added successfully.",
  "contractor": {
    "_id": "676711a42c37afc1da65ef6f",
    "name": "mastek",
    "phone": "1111111111",
    "userId": "67643904dec70c21d0748ca3",
    "createdAt": "2024-12-21T19:06:12.365Z",
    "updatedAt": "2024-12-21T19:06:12.365Z",
    "__v": 0
  }
}
```

