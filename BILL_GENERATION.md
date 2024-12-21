## Detailed Workflow for Billing

1. **Adding Locations to Work Orders**

   - A separate document for each location is added to the `workorderlocations` collection with the contractor ID, rate, and quantity.
   - For every location added to a work order, an individual document is created with the `contractorId`.

2. **Marking Locations as Completed**

   - When a location is marked as completed with a contractor:
     - The `state` of the location is updated to `Completed` in both the `locations` and `workorderlocations` collections.
     - In `bills` collection
     - If an ongoing bill document exists and a location is marked as completed:
       - The total amount of the location is added to the existing total in the bill document.
     - If no ongoing bill document exists:
       - A new bill document is created with the total amount from the location and a unique bill number sequence.

3. **Types of Documents in the `bills` Collection**

   - **Generated Bills**:
     - These have a `billingProcessId`.
   - **Ongoing Bills**:
     - These do not have a `billingProcessId`.

4. **Ongoing Bill Workflow**

   - If an ongoing bill document exists and a location is marked as completed:
     - The total amount of the location is added to the existing total in the bill document.
   - If no ongoing bill document exists:
     - A new bill document is created with the total amount from the location and a unique bill number sequence.

5. **Generated Bill Workflow**

   - api - `POST - bill/` generates bill
   - When a bill is generated (i.e., the **Generate Bill** button is clicked in the Bills Tab):
     - All ongoing bill documents are marked as generated bill documents.
       - `bills` collection
         - match - documents with corresponding `userId` and `billingProcessId` : `not exists`
         - update - `set` - `billingProcessId`
     - All `workorderlocations` documents with:
       - `workorderlocations` collection
       - match - `state`: `Completed` & `billed`: `false`
       - Are assigned the `billingProcessId`.

6. **Detailed Bill** - with each location name and rates
   - `workorderlocations` collection with `state`:`Completed` & `billed`:`true` matched with `contractorId` & `billingProcessId`
     gives the detailed bill
