import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { AppService } from '../app.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { MatButtonModule } from '@angular/material/button';
import { DetailedBillComponent } from './detailed-bill/detailed-bill.component';

export interface Bill {
  billNo: number;
  contractor: string;
  billingProcessId: string;
  billedAt: string;
  totalAmount: number;
  _id:string
}

@Component({
  selector: 'app-bills',
  imports: [DatePipe, MatTableModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css',
})
export class BillsComponent implements OnInit {
  displayedColumns: string[] = [
    'billNo',
    'contractor',
    'totalAmount',
    'billedAt',
    'showDetails',
  ];
  dataSource: Bill[] = [];

  loading: boolean = true;

  constructor(
    private matDialog: MatDialog,
    private appService: AppService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    if (!this.appService.loggedIn.getValue()) {
      return;
    }
    this.getBills();
  }

  getBills() {
    this.api.getBills().subscribe((res) => {
      if (!res) {
      } else this.dataSource = res;
      this.loading = false;
    });
  }

  showDetails(element: Bill) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = element._id
    dialogConfig.width = "40rem"
    dialogConfig.maxWidth = "40rem"
    dialogConfig.height = "50rem"
    const instance = this.matDialog.open(DetailedBillComponent, dialogConfig);
  }
}
