import { Component, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../api.service';
import { WorkOrder } from '../../work-orders/work-orders.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-location-row',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './location-row.component.html',
  styleUrl: './location-row.component.css',
})
export class LocationRowComponent {
  constructor(private snackbar: MatSnackBar, private apiService: ApiService) {}

  @Input() location: any | null = null;
  @Input() workOrder: WorkOrder | null = null;
  @Output() remove = new Subject<void>()

  saving: boolean = false;

  save() {
    if (
      !this.location.rate ||
      !this.location.quantity ||
      this.location.rate < 1 ||
      this.location.quantity < 1
    ) {
      this.snackbar.open('Form is not valid', 'Dismiss');
      return;
    }

    this.saving = true;

    this.apiService
      .saveWorkOrderLocation({
        ...this.location,
        workOrderId: this.workOrder?._id,
      })
      .subscribe((res) => {
        if (!res) {
        } else {
          this.location.saved = true;
        }
        this.saving = false;
      });
  }

  delete() {
    this.remove.next()
  }
}
