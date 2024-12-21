import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { KpiComponent } from './kpi/kpi.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { catchError, filter, of } from 'rxjs';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  imports: [ MatTabsModule, RouterOutlet, RouterModule,MatProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'WOMS';

  activeLink: string = 'Contractors';

  links: { link: string; url: string }[] = [
    {
      link: 'Contractors',
      url: 'contractors',
    },
    {
      link: 'Entities',
      url: 'entities',
    },
    {
      link: 'Locations',
      url: 'locations',
    },
    {
      link: 'Work Orders',
      url: 'work-orders',
    },
    {
      link: 'Bills',
      url: 'bills',
    },
  ];

  loading:boolean = true

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private service:AppService
  ) {}

  ngOnInit(): void {
    this.login();
  }

  login() {
    this.http
      .post<{ message: string }>(`${environment.base_url}/login`,{},{withCredentials:true})
      .pipe(catchError((err)=>{
        this.snackBar.open('Login Failed','Dismiss')
        return of({message:null})
      }))
      .subscribe((res) => {
        if(!res.message) return
        this.snackBar.open('Login Successful','Dismiss')
        this.loggedIn()
        this.service.loggedIn.next(true)
        this.loading = false
      }); 
  }

  loggedIn(){
    const url = this.router.url.split('/').filter((url) => url.trim())?.[0];
    if (url) {
      const activeLink = this.links.find((link) => link.url == url);
      if (activeLink) {
        this.activeLink = activeLink.link;
      }
    }
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects
          .split('/')
          .filter((url) => url.trim())?.[0];
        if (url) {
          const activeLink = this.links.find((link) => link.url == url);
          if (activeLink) {
            this.activeLink = activeLink.link;
          }
        }
      });
  }
}
