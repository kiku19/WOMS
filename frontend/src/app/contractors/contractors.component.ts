import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { environment } from '../../environments/environment';
import { catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddContractorComponent } from '../add-contractor/add-contractor.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppService } from '../app.service';
export interface Contractor {
  name: string;
  phone: string;
  _id?: string;
}

@Component({
  selector: 'app-contractors',
  imports: [MatTableModule, MatButtonModule,MatProgressBarModule],
  templateUrl: './contractors.component.html',
  styleUrl: './contractors.component.css',
})
export class ContractorsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private appService:AppService
  ) {}

  loading:boolean = true

  displayedColumns: string[] = ['name', 'phone'];
  dataSource: Contractor[] = [];

  ngOnInit(): void {
    if (!this.appService.loggedIn.getValue()) {
      return;
    }
    this.getContractors();
  }

  getContractors() {
    this.http
      .get<Contractor[]>(`${environment.base_url}/contractors`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe((res) => {
        if (!res) {
          this.snackBar.open('Failed to fetch contractors.', 'Dismiss');
        }
        else this.dataSource = res;
        this.loading = false
      });
  }

  openAddContractor() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 

    const instance = this.matDialog.open(AddContractorComponent,dialogConfig);

    instance.afterClosed().subscribe((res: { contractor: Contractor }) => {
      if (res) {
        this.snackBar.open('Contractor added successfully', 'Dismiss');
        this.dataSource = [...this.dataSource, res.contractor];
      }
      // subscription.unsubscribe();
    });
  }
}
