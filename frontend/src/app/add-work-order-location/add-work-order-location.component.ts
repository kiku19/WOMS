import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../api.service';
import { Location } from '../locations/locations.component';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { LocationRowComponent } from './location-row/location-row.component';
import { WorkOrder } from '../work-orders/work-orders.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface WorkOrderLocation {
  location: string;
  entity: string;
  rate: number;
  quantity: number;
  _id?: string;
}

@Component({
  selector: 'app-add-work-order-location',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatDatepickerModule,
    LocationRowComponent,
    MatProgressBarModule,
  ],
  templateUrl: './add-work-order-location.component.html',
  styleUrl: './add-work-order-location.component.css',
})
export class AddWorkOrderLocationComponent implements OnInit, OnDestroy {
  readonly data = inject<WorkOrder>(MAT_DIALOG_DATA);

  constructor(
    private ref: MatDialogRef<AddWorkOrderLocationComponent>,
    private toaster: MatSnackBar,
    private api: ApiService
  ) {}

  unSub: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  }

  location = new FormControl('');
  searching: boolean = false;
  locations: Location[] = [];
  previousRequestSubscription: Subscription | null = null;

  saving: boolean = false;

  ngOnInit(): void {
    this.getSavedLocations();
    this.location.valueChanges
      .pipe(takeUntil(this.unSub), debounceTime(200))
      .subscribe((res) => {
        if (this.previousRequestSubscription) {
          this.previousRequestSubscription.unsubscribe();
        }
        if (typeof res == 'string' && res?.trim()) {
          this.searching = true;
          this.previousRequestSubscription = this.api
            .searchLocations(res)
            .subscribe((res) => {
              if (res) {
                this.locations = res;
              }
              this.searching = false;
            });
        }
      });
  }

  locationsLoaded: boolean = false;
  getSavedLocations() {
    this.api.getWorkOrderLocations(this.data._id!)
    .pipe(takeUntil(this.unSub))
    .subscribe((res)=>{
      if(!res){

      }
      else {
        this.selectedLocations = res
      }
      this.locationsLoaded = true
    })
  }

  displayFn(location: Location): string {
    return '';
  }

  selectedLocations: WorkOrderLocation[] = [];

  onOptionSelected(event: any) {
    const location = event?.option?.value;
    console.log(location);
    const workOrderLocation: WorkOrderLocation = {
      entity: location.entity,
      location: location.name,
      quantity: 0,
      rate: 0,
      _id: location._id,
    };
    this.selectedLocations.push(workOrderLocation);
  }

  cancel() {
    this.ref.close();
  }

  removeSelectedLocation(location:WorkOrderLocation){
    const index = this.selectedLocations.findIndex((workOrderLocation)=>{
     return workOrderLocation._id == location._id
    })

    index!=-1 && this.selectedLocations.splice(index,1)
  }
}
