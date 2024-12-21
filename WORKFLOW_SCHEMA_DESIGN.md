# Workflow and Schema Design

## Workflow Overview

1. **Create a Contractor**
   - Navigate to the **Contractors Tab** to add a new contractor.

2. **Create an Entity**
   - Navigate to the **Entities Tab** to add a new entity.

3. **Create a Location**
   - Navigate to the **Locations Tab** to add a new location.

4. **Add a Work Order**
   - Navigate to the **Work Orders Tab** to add a new work order.

5. **Add the Location to a Work Order**
   - Assign the location to a work order.
   - Set the rate and quantity for the location.
   - Press the tick button to save these details to the work order.

6. **Mark as Completed**
   - In the **Locations Tab**, update the location's state to `Completed`.

7. **Generate a Bill**
   - Navigate to the **Bills Tab** to generate a bill.

---

## Schema Design

### `billnos` Collection
This collection maintains the bill number sequence for each user.

#### Schema:
```json
{
  "sequence": "Number",
  "userId": "ObjectId"
}
```

---

### `bills` Collection
This collection stores bill details for each user.

#### Schema:
```json
{
  "userId": "ObjectId",
  "billNo": "Number (optional)",
  "totalAmount": "Number",
  "contractorId": "ObjectId",
  "billingProcessId": "ObjectId (optional)",
  "billedAt": "Date (optional)"
}
```

---

### `contractors` Collection
This collection stores contractor information for each user.

#### Schema:
```json
{
  "name": "String",
  "phone": "String",
  "userId": "ObjectId"
}
```

---

### `entities` Collection
This collection stores entity information for each user.

#### Schema:
```json
{
  "name": "String",
  "userId": "ObjectId",
  "locationCount": "Number"
}
```

---

### `locations` Collection
This collection stores location details associated with entities.

#### Schema:
```json
{
  "name": "String",
  "state": "String ('Ready' | 'Completed')",
  "entityId": "ObjectId",
  "userId": "ObjectId"
}
```

---

### `workorders` Collection
This collection stores work order details for each user.

#### Schema:
```json
{
  "contractorId": "ObjectId",
  "paymentTerms": "Number",
  "dueDate": "Date",
  "userId": "ObjectId"
}
```

---

### `workorderlocations` Collection
This collection stores location details (with rates and quantities) associated with work orders.

#### Schema:
```json
{
  "workOrderId": "ObjectId",
  "locationId": "ObjectId",
  "rate": "Number",
  "quantity": "Number",
  "contractorId": "ObjectId",
  "userId": "ObjectId",
  "state": "String ('Ready' | 'Completed')",
  "billed": "Boolean",
  "billingProcessId": "ObjectId (optional)",
  "isDeleted": "Boolean"
}
```

