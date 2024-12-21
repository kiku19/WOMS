import { Component } from '@angular/core';

@Component({
  selector: 'app-kpi',
  imports: [],
  templateUrl: './kpi.component.html',
  styleUrl: './kpi.component.css'
})
export class KpiComponent {

  items:{key:string,value:number}[] = [
    {
      key:"Contractors",
      value:0
    },
    {
      key:"Entities",
      value:0
    },
    {
      key:"Locations",
      value:0
    },
    {
      key:"Generated Bills",
      value:0
    },
  ]

}
