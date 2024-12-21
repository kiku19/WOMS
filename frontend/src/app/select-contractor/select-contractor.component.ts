import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntil, debounceTime, Subject, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { Contractor } from '../contractors/contractors.component';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '../locations/locations.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-select-contractor',
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
  ],
  templateUrl: './select-contractor.component.html',
  styleUrl: './select-contractor.component.css',
})
export class SelectContractorComponent implements OnInit, OnDestroy {
  readonly data = inject<Location>(MAT_DIALOG_DATA);

  constructor(
    private ref: MatDialogRef<SelectContractorComponent>,
    private toaster: MatSnackBar,
    private api: ApiService
  ) {}

  unSub: Subject<void> = new Subject<void>();

  contractor = new FormControl('', [Validators.required]);

  ngOnDestroy(): void {}

  previousRequestSubscription: Subscription | null = null;
  searchingContractor: boolean = false;
  contractors: Contractor[] = [];
  ngOnInit(): void {
    this.contractor.valueChanges
      .pipe(takeUntil(this.unSub), debounceTime(200))
      .subscribe((res) => {
        if (this.previousRequestSubscription) {
          this.previousRequestSubscription.unsubscribe();
        }
        if (typeof(res)=='string' && res.trim()) {
          this.searchingContractor = true;
          this.searchContractors(res)
        }
      });
    
    this.searchContractors("")
  }

  searchContractors(searchTerm:string){
    this.previousRequestSubscription = this.api
    .searchContractorsWithLocation(searchTerm,this.data._id!)
    .subscribe((res) => {
      if (res) {
        this.contractors = res;
      }
      this.searchingContractor = false;
    });
  }


  cancel() {
    this.ref.close();
  }

  saving: boolean = false;

  save() {
    if (!this.contractor.valid) {
      this.toaster.open('Select a contractor.', 'Dismiss');
      return;
    }
    const value: any = this.contractor.value;
    if (!value || !value._id) {
      this.contractor.setErrors({ required: true });
      return;
    }
    this.saving = true;
    this.api
      .markAsCompleted({
        locationId: this.data._id!,
        contractorId: value?._id!,
      })
      .subscribe((res) => {
        if(!res){
          this.ref.close()
        }
        else this.ref.close(true)
        this.saving = false;

      });
  }

  displayFn(contractor: Contractor): string {
    return contractor && contractor.name ? contractor.name : '';
  }
}
