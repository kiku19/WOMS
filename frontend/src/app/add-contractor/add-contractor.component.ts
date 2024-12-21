import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-add-contractor',
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
  templateUrl: './add-contractor.component.html',
  styleUrl: './add-contractor.component.css',
})
export class AddContractorComponent {
  constructor(
    private ref: MatDialogRef<AddContractorComponent>,
    private toaster: MatSnackBar,
    private api: ApiService
  ) {}

  contractor = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    phone: new FormControl('', [
      Validators.pattern(/^\d+$/),
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
    ]),
  });

  matcher = new ErrorStateMatcher();

  cancel() {
    this.ref.close();
  }

  saving = false

  save() {
    if (!this.contractor.valid) {
      this.contractor.markAllAsTouched()
      this.toaster.open('Form not valid', 'Dismiss');
      return;
    }
    const value = this.contractor.value;
    if (!value.name?.trim()) {
      this.contractor.get('name')?.setErrors({ required: true });
      return;
    }

    if (!value.phone?.trim()) {
      this.contractor.get('phone')?.setErrors({ required: true });
      return
    } 

    const payload = {
      name:value.name,
      phone:value.phone
    }
    this.saving = true
    this.api.saveContractor(payload).subscribe((res)=>{
      if(!res) return
      this.saving = false
      this.ref.close(res);
    })

  }
}
