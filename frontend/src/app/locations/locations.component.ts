import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AppService } from '../app.service';
import { ApiService } from '../api.service';
import { AddLocationComponent } from '../add-location/add-location.component';
import { SelectContractorComponent } from '../select-contractor/select-contractor.component';

export interface Location {
  name: string;
  entityId: string;
  _id?: string;
}

@Component({
  selector: 'app-locations',
  imports: [MatTableModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css',
})
export class LocationsComponent {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private appService: AppService,
    private api: ApiService
  ) {}

  loading: boolean = true;

  displayedColumns: string[] = ['name', 'entity', 'state', 'markAsCompleted'];
  dataSource: Location[] = [];

  ngOnInit(): void {
    this.getLocations();
  }

  getLocations() {
    if (!this.appService.loggedIn.getValue()) {
      return;
    }
    this.api.getLocations().subscribe((res) => {
      if (res) {
        this.dataSource = res;
      }
      this.loading = false;
    });
  }

  openAddLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    const instance = this.matDialog.open(AddLocationComponent, dialogConfig);

    instance.afterClosed().subscribe((res: { location: Location }) => {
      if (res) {
        this.snackBar.open('Location added successfully', 'Dismiss');
        this.dataSource = [...this.dataSource, res.location];
      }
    });
  }

  markingAsCompletedIndex: string[] = [];

  markAsCompleted(element: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height = '40vh';
    dialogConfig.width = '50vw';
    dialogConfig.data = element;

    const instance = this.matDialog.open(
      SelectContractorComponent,
      dialogConfig
    );

    instance.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.snackBar.open('Status updated successfully', 'Dismiss');
        element.state = 'Completed'
        return;
      }
    });
  }

  generatingBill:boolean = false
  generateBill(){
    this.generatingBill = true
    this.api.generateBill().subscribe((res)=>{
      if(!res){
        
      }
      else {
        this.snackBar.open('Bill generated successfully.','Dismiss')
      }
      this.generatingBill = false
    })
  }
}
