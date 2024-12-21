import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { AppService } from '../../app.service';
import { ApiService } from '../../api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LocationBill {
  location:string,
  rate:number,
  quantity:number
}

@Component({
  selector: 'app-detailed-bill',
  imports: [MatTableModule, MatProgressBarModule],
  templateUrl: './detailed-bill.component.html',
  styleUrl: './detailed-bill.component.css'
})
export class DetailedBillComponent implements OnInit {
  readonly data = inject<string>(MAT_DIALOG_DATA);

  displayedColumns: string[] = [
    'location',
    'rate',
    'quantity'
  ];

  dataSource:LocationBill[] = [];

  loading: boolean = true;


  constructor(
    private appService: AppService,
    private api:ApiService
  ) {}

  ngOnInit(): void {
    if (!this.appService.loggedIn.getValue()) {
      return;
    }
    this.getDetailedBill();
  }

  getDetailedBill(){
    this.api.getDetailedBills(this.data).subscribe((res) => {
      if (!res) {
      } else this.dataSource = res;
      this.loading = false;
    });
  }
}
