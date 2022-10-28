import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { ReservaModalComponent } from '../reserva-modal/reserva-modal.component';
import {MediaMatcher} from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs';
import { Menu } from '../models/menu.model';
import { HttpClient } from '@angular/common/http';
import { Reserva } from '../models/reserva.model';
import { Comanda } from '../models/comanda.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menu:Menu={'products':[]};
  menu_url ='https://la-jatata.herokuapp.com/menu'
  reservations_url ='https://la-jatata.herokuapp.com/reservas'
  comandas_url ='https://la-jatata.herokuapp.com/comandas/menu'
  reservations: Reserva[] = [];
  comandas: Comanda[] = [];
  date:Date = new Date();
  
  constructor(private  dialog:  MatDialog, private  router:  Router,private observer: BreakpointObserver,public http: HttpClient) {
  }
  ngOnInit(): void {
    this.date.setHours(0, 0, 0, 0);
    this.getComandas();
    this.getMenu();
    //this.getReservations();
  }
  getComandas(){
    let url = this.comandas_url + '?date='+ this.date
    this.http.get<Comanda[]>(url).subscribe(data =>{ 
      this.comandas = Object.values(data);
      console.log(this.comandas)
      this.getReservations();
      //this.fillReservated();
    });
  }
  menuExists(){
    return this.menu != undefined
    //console.log(this.menu)
  }
  reservationExists(){
    return this.reservations.length>0;
  }
  isWeekend(){
    var day= this.date.getDay()
    return day ===6 || day ===0
  }

  getReservations(){
    let url = this.reservations_url + '?date='+ this.date
    this.http.get<Reserva[]>(url).subscribe(data =>{ 
      this.reservations = Object.values(data);
      this.fillReservated();
    });
  }
  fillReservated(){
    console.log(this.reservations)
    if(this.menu != undefined){
      for(let i =0;i<this.menu.products!.length;i++){
        this.menu.products![i].reservated= this.getReservated(this.menu.products![i].product_id!)
        this.menu.products![i].delivered= this.getDelivered(this.menu.products![i].product_id!)
      }
    }
  }
  getReservated(product_id:number){
    let cantReservated = 0;
    for(let i =0;i<this.reservations.length;i++){
      for(let j =0;j<this.reservations[i].products!.length;j++){
        if(this.reservations[i].products![j].product_id === product_id){
          cantReservated+= this.reservations[i].products![j].quantity!
        }
      }
    }
    return cantReservated;
  }
  getDelivered(product_id:number){
    let cantDelivered = 0;
    for(let i =0;i<this.comandas.length;i++){
      for(let j =0;j<this.comandas[i].products!.length;j++){
        if(this.comandas[i].products![j].product_id === product_id && this.comandas[i].products![j].state === 'Entregado'){
          cantDelivered+= this.comandas[i].products![j].quantity!
        }
      }
    }
    return cantDelivered;
  }
  showForm(){
    const ref =this.dialog.open(ReservaModalComponent)
  }
  getMenu(){
    //let date:Date = new Date();
    //date.setHours(0, 0, 0, 0);
    let dateurl = this.menu_url + '?date=' + this.date//.toISOString()
    console.log(dateurl)
    this.http.get<Menu[]>(dateurl).subscribe(data =>{ 
        this.menu = data[0];
    });
  }
  
  getColor(cant:number) { 
    let color ='';
    if(cant>15){
      color = '#00e676';
    }
    else if(cant<=15 && cant>3){
      color = '#F3EA5F';
    }
    else{
      color= '#F37A5F';
    }
    return color;
  }

 

}
