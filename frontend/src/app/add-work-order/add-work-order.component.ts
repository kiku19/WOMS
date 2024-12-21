import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  ErrorStateMatcher,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription, takeUntil, debounceTime } from 'rxjs';
import { ApiService } from '../api.service';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Contractor } from '../contractors/contractors.component';
import { pastDateValidator } from '../validators/past-date.validator';

@Component({
  selector: 'app-add-work-order',
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-work-order.component.html',
  styleUrl: './add-work-order.component.css',
})
export class AddWorkOrderComponent {
  unSub: Subject<void> = new Subject<void>();

  constructor(
    private ref: MatDialogRef<AddWorkOrderComponent>,
    private toaster: MatSnackBar,
    private api: ApiService
  ) {}

  workOrder = new FormGroup({
    contractor: new FormControl('', [Validators.required]),
    paymentTerms: new FormControl(0, [
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.max(9999),
      Validators.min(1)
    ]),
    dueDate: new FormControl('', [Validators.required, pastDateValidator()]),
  });

  matcher = new ErrorStateMatcher();

  today = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
  maxDate = `${new Date().getFullYear()+99}-${new Date().getMonth()+1}-${new Date().getDate()}`

  ngOnInit(): void {
    this.listenForChanges();
  }

  cancel() {
    this.ref.close();
  }

  saving = false;

  save() {
    if (!this.workOrder.valid) {
      this.workOrder.markAllAsTouched();
      this.toaster.open('Form not valid', 'Dismiss');
      return;
    }
    const value = this.workOrder.value;

    if (!(value.contractor as unknown as Contractor)?._id) {
      this.workOrder.get('contractor')?.setErrors({ required: true });
      return;
    }

    if (!value.paymentTerms) {
      this.workOrder.get('paymentTerms')?.setErrors({ required: true });
      return;
    }

    if (!value.dueDate) {
      this.workOrder.get('dueDate')?.setErrors({ required: true });
      return
    }

    const payload = {
      contractorId: (value.contractor as unknown as Contractor)?._id!,
      paymentTerms: value.paymentTerms!,
      dueDate:value.dueDate!
    };
    this.saving = true;

    this.api.saveWorkOrder(payload).subscribe((res) => {
      if (res) {
        this.ref.close(res);
      }
      this.saving = false;
    });
  }

  contractors: Contractor[] = [];
  searchingContractor: boolean = false;
  previousRequestSubscription: Subscription | null = null;
  listenForChanges() {
    this.workOrder
      .get('contractor')
      ?.valueChanges.pipe(takeUntil(this.unSub), debounceTime(200))
      .subscribe((res) => {
        if (this.previousRequestSubscription) {
          this.previousRequestSubscription.unsubscribe();
        }
        if (typeof(res)=='string' && res?.trim()) {
          this.searchingContractor = true;
          this.previousRequestSubscription = this.api
            .searchContractors(res)
            .subscribe((res) => {
              if (res) {
                this.contractors = res;
              }
              this.searchingContractor = false;
            });
        }
      });
  }

  displayFn(contractor: Contractor): string {
    return contractor && contractor.name ? contractor.name : '';
  }

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  }
}
