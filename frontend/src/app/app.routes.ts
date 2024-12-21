import { Routes } from '@angular/router';
import { ContractorsComponent } from './contractors/contractors.component';
import { EntitiesComponent } from './entities/entities.component';
import { LocationsComponent } from './locations/locations.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
// import { WorkAllotmentComponent } from './work-allotment/work-allotment.component';
import { BillsComponent } from './bills/bills.component';

export const routes: Routes = [
  { path: 'contractors', component: ContractorsComponent },
  { path: 'entities', component: EntitiesComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'work-orders', component: WorkOrdersComponent },
  // { path: 'work-allotment', component: WorkAllotmentComponent },
  { path: 'bills', component: BillsComponent },
  { path: '/', component: ContractorsComponent }, 
];
