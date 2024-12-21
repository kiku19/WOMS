import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { AddWorkOrderComponent } from '../add-work-order/add-work-order.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';
import { AppService } from '../app.service';
import { DatePipe } from '@angular/common';
import { AddWorkOrderLocationComponent } from '../add-work-order-location/add-work-order-location.component';

export interface WorkOrder {
  contractor: string;
  paymentTerms: number;
  dueDate: string;
  locations: string[];
  _id?: string;
}

@Component({
  selector: 'app-work-orders',
  imports: [MatTableModule, MatButtonModule, MatProgressBarModule, DatePipe],
  templateUrl: './work-orders.component.html',
  styleUrl: './work-orders.component.css',
})
export class WorkOrdersComponent {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private appService: AppService,
    private api: ApiService
  ) {}

  loading: boolean = true;

  displayedColumns: string[] = [
    'contractor',
    'paymentTerms',
    'dueDate',
    'addLocation',
  ];
  dataSource: WorkOrder[] = [];

  ngOnInit(): void {
    this.getWorkOrders();
  }

  getWorkOrders() {
    if (!this.appService.loggedIn.getValue()) {
      return;
    }
    this.api.getWorkOrders().subscribe((res) => {
      if (res) {
        this.dataSource = res;
      }
      this.loading = false;
    });
  }

  openAddWorkOrder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '65vw';
    dialogConfig.height = '35vh';
    const instance = this.matDialog.open(AddWorkOrderComponent, dialogConfig);

    instance.afterClosed().subscribe((res: { workOrder: WorkOrder }) => {
      if (res) {
        this.snackBar.open('Work order added successfully', 'Dismiss');
        this.dataSource = [...this.dataSource, res.workOrder];
      }
    });
  }

  openAddLocation(element: WorkOrder) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '80rem';
    dialogConfig.width = '80rem';
    dialogConfig.height = '70vh';
    dialogConfig.data = element;
    const instance = this.matDialog.open(
      AddWorkOrderLocationComponent,
      dialogConfig
    );
  }
}
