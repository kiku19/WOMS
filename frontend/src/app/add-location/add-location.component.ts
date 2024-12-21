import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounce, debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { Location } from '../locations/locations.component';
import { Entity } from '../entities/entities.component';

@Component({
  selector: 'app-add-location',
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
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.css',
})
export class AddLocationComponent implements OnDestroy, OnInit {
  unSub: Subject<void> = new Subject<void>();

  constructor(
    private ref: MatDialogRef<AddLocationComponent>,
    private toaster: MatSnackBar,
    private api: ApiService
  ) {}

  location = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    entity: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
  });

  matcher = new ErrorStateMatcher();

  ngOnInit(): void {
    this.listenForChanges();
  }

  cancel() {
    this.ref.close();
  }

  saving = false;

  save() {
    if (!this.location.valid) {
      this.location.markAllAsTouched();
      this.toaster.open('Form not valid', 'Dismiss');
      return;
    }
    const value = this.location.value;
    if (!value.name?.trim()) {
      this.location.get('name')?.setErrors({ required: true });
      return;
    }

    if (!(value.entity as unknown as Entity)?._id) {
      this.location.get('entity')?.setErrors({ required: true });
      return;
    }

    const payload = {
      name: value.name,
      entityId: (value.entity as unknown as Entity)._id!,
    };

    this.saving = true;
    this.api.saveLocation(payload).subscribe((res) => {
      if (res) {
        this.ref.close(res);
      }
      this.saving = false;
    });
  }

  filteredOptions: Entity[] = [];
  searching: boolean = false;
  previousRequestSubscription: Subscription | null = null;
  listenForChanges() {
    this.location
      .get('entity')
      ?.valueChanges.pipe(takeUntil(this.unSub),debounceTime(200))
      .subscribe((res) => {
        if (this.previousRequestSubscription) {
          this.previousRequestSubscription.unsubscribe();
        }
        if (res?.trim()) {
          this.searching = true
          this.previousRequestSubscription = this.api
            .searchEntities(res)
            .subscribe((res) => {
              if (res) {
                this.filteredOptions = res;
              }
              this.searching = false
            });
        }
      });
  }

  displayFn(location: Location): string {
    return location && location.name ? location.name : '';
  }

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  }
}
