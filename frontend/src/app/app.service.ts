import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  loggedIn:BehaviorSubject<boolean> = new BehaviorSubject<boolean> (false)
}
