import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-add-entity',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
  ],
  templateUrl: './add-entity.component.html',
  styleUrl: './add-entity.component.css',
})
export class AddEntityComponent {
  constructor(
    private ref: MatDialogRef<AddEntityComponent>,
    private toaster: MatSnackBar,
    private api: ApiService
  ) {}

  entity = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  matcher = new ErrorStateMatcher();

  cancel() {
    this.ref.close();
  }

  saving = false;

  save() {
    if (!this.entity.valid) {
      this.entity.markAllAsTouched();
      this.toaster.open('Form not valid', 'Dismiss');
      return;
    }
    const value = this.entity.value;
    if (!value.name?.trim()) {
      this.entity.get('name')?.setErrors({ required: true });
      return;
    }

    const payload = {
      name: value.name,
    };
    this.saving = true;
    this.api.saveEntity(payload).subscribe((res) => {
      if (!res) return;
      this.saving = false;
      this.ref.close(res);
    });
  }
}
