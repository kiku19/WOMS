import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AddEntityComponent } from '../add-entity/add-entity.component';
import { AppService } from '../app.service';
import { ApiService } from '../api.service';

export interface Entity {
  name: string;
  userId: string;
  locationCount: number;
  _id?:string
}

@Component({
  selector: 'app-entities',
  imports: [MatTableModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './entities.component.html',
  styleUrl: './entities.component.css',
})
export class EntitiesComponent {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private appService: AppService,
    private api: ApiService
  ) {}

  loading: boolean = true;

  displayedColumns: string[] = ['name', 'locations'];
  dataSource: Entity[] = [];

  ngOnInit(): void {
    this.getEntities();
  }

  getEntities() {
    if (!this.appService.loggedIn.getValue()) {
      return;
    }
    this.api.getEntities().subscribe((res) => {
      if (res) {
        this.dataSource = res;
      }
      this.loading = false;
    });
  }

  openAddEntity() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    const instance = this.matDialog.open(AddEntityComponent, dialogConfig);

    instance.afterClosed().subscribe((res: { entity: Entity }) => {
      if (res) {
        this.snackBar.open('Entity added successfully', 'Dismiss');
        this.dataSource = [...this.dataSource, res.entity];
      }
    });
  }
}
