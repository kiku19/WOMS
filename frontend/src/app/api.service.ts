import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contractor } from './contractors/contractors.component';
import { Entity } from './entities/entities.component';
import { Location } from './locations/locations.component';
import { WorkOrder } from './work-orders/work-orders.component';
import { WorkOrderLocation } from './add-work-order-location/add-work-order-location.component';
import { Bill } from './bills/bills.component';
import { LocationBill } from './bills/detailed-bill/detailed-bill.component';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private snackbar: MatSnackBar) {}

  searchContractors(searchTerm: string) {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http
      .get<Contractor[]>(`${environment.base_url}/contractors/search`, {
        withCredentials: true,
        params,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch contractors', 'Dismiss');
          return of(null);
        })
      );
  }

  searchContractorsWithLocation(searchTerm: string, locationId: string) {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('locationId', locationId);

    return this.http
      .get<Contractor[]>(
        `${environment.base_url}/contractors/searchWithLocation`,
        {
          withCredentials: true,
          params,
        }
      )
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch contractors', 'Dismiss');
          return of(null);
        })
      );
  }

  saveContractor(contractor: { name: string; phone: string }) {
    return this.http
      .post<Contractor>(`${environment.base_url}/contractors`, contractor, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          if (err.error.code == 1) {
            this.snackbar.open('Phone number already exists', 'Dismiss');
          } else
            this.snackbar.open('Failed to save the contractor.', 'Dismiss');
          return of(null);
        })
      );
  }

  getEntities() {
    return this.http
      .get<Entity[]>(`${environment.base_url}/entity`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch entities', 'Dismiss');
          return of(null);
        })
      );
  }

  searchEntities(searchTerm: string) {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http
      .get<Entity[]>(`${environment.base_url}/entity/search`, {
        withCredentials: true,
        params,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch entities', 'Dismiss');
          return of(null);
        })
      );
  }

  saveEntity(entity: { name: string }) {
    return this.http
      .post<Entity>(`${environment.base_url}/entity`, entity, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to save the entity.', 'Dismiss');
          return of(null);
        })
      );
  }

  getLocations() {
    return this.http
      .get<Location[]>(`${environment.base_url}/location`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch locations', 'Dismiss');
          return of(null);
        })
      );
  }

  searchLocations(searchTerm: string) {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http
      .get<Location[]>(`${environment.base_url}/location/search`, {
        withCredentials: true,
        params,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch locations', 'Dismiss');
          return of(null);
        })
      );
  }

  saveLocation(location: { name: string; entityId: string }) {
    return this.http
      .post<Location>(`${environment.base_url}/location`, location, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to save the location.', 'Dismiss');
          return of(null);
        })
      );
  }

  getWorkOrders() {
    return this.http
      .get<WorkOrder[]>(`${environment.base_url}/work-order`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch work orders.', 'Dismiss');
          return of(null);
        })
      );
  }

  saveWorkOrder(workOrder: {
    contractorId: string;
    paymentTerms: number;
    dueDate: string;
  }) {
    return this.http
      .post<WorkOrder>(`${environment.base_url}/work-order`, workOrder, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          if (err.error.code == 1) {
            this.snackbar.open(
              'Contractor already has a work order.',
              'Dismiss'
            );
          } else {
            this.snackbar.open('Failed to save the work order.', 'Dismiss');
          }
          return of(null);
        })
      );
  }

  getWorkOrderLocations(workOrderId: string) {
    const params = new HttpParams().set('workOrderId', workOrderId);

    return this.http
      .get<WorkOrderLocation[]>(
        `${environment.base_url}/work-order/locations`,
        {
          withCredentials: true,
          params,
        }
      )
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch work orders.', 'Dismiss');
          return of(null);
        })
      );
  }

  saveWorkOrderLocation(payload: WorkOrderLocation) {
    return this.http
      .post<WorkOrderLocation>(
        `${environment.base_url}/work-order/location`,
        payload,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((err) => {
          if (err.error.code == 1) {
            this.snackbar.open('Location exists.', 'Dismiss');
          } else {
            this.snackbar.open('Failed to save the work order.', 'Dismiss');
          }
          return of(null);
        })
      );
  }

  markAsCompleted({
    locationId,
    contractorId,
  }: {
    locationId: string;
    contractorId: string;
  }) {
    return this.http
      .put<any[]>(
        `${environment.base_url}/location/markAsCompleted`,
        {
          locationId,
          contractorId,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((err) => {
          if (err.error.code == 1) {
            this.snackbar.open(
              'Failed to update the status, Please refresh the screen to get the updated document.',
              'Dismiss'
            );
          } else {
            this.snackbar.open('Failed to update the status', 'Dismiss');
          }
          return of(null);
        })
      );
  }

  getBills() {
    return this.http
      .get<Bill[]>(`${environment.base_url}/bill`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch bills.', 'Dismiss');
          return of(null);
        })
      );
  }

  getDetailedBills(billId: string) {
    const params = new HttpParams().set('billId', billId);
    return this.http
      .get<LocationBill[]>(`${environment.base_url}/bill/detail`, {
        withCredentials: true,
        params,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to fetch bills.', 'Dismiss');
          return of(null);
        })
      );
  }

  generateBill() {
    return this.http
      .post<any[]>(
        `${environment.base_url}/bill/`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((err) => {
          if (err.error.code == 1) {
            this.snackbar.open(
              'None of the locations are marked as completed.',
              'Dismiss'
            );
          } else this.snackbar.open('Failed to generate bill', 'Dismiss');
          return of(null);
        })
      );
  }
}
