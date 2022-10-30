import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Reserva } from '../models/reserva.model';
import { ReciboModalComponent } from '../recibo-modal/recibo-modal.component';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-allreservas',
  templateUrl: './allreservas.component.html',
  styleUrls: ['./allreservas.component.scss']
})
export class AllreservasComponent implements OnInit {
  date: Date = new Date();
  reservations: Reserva[] = [];
  //url ='http://localhost:3000/reservas'
  url = 'https://la-jatata.herokuapp.com/reservas'
  subscription: Subscription = new Subscription;
  searchValue = '';

  constructor(route:ActivatedRoute,public http: HttpClient,private  dialog:  MatDialog,private reservation:ReservationService,private  router:  Router) {
    route.params.subscribe(val => {
      this.getReservas();
    });
    //this.router.onSameUrlNavigation='reload'
    //this.getReservas();
   }
   filterReservations(){
    let url;
    if(this.searchValue ===''){
      this.getReservas();
    }
    else{
      url = this.url + '/filter?search='+ this.searchValue +'&date='+this.date;
      this.http.get<Reserva[]>(url).subscribe(data =>{ 
        this.reservations = Object.values(data);
        //this.allProducts = this.products;
        console.log(this.reservations);
      });
    }
  }
  showSearchBar(){
    document.getElementById('mini-topnav')!.style.display='flex'
  }
  closeSearchBar(){
    document.getElementById('mini-topnav')!.style.display='none'
  }
   getReservas(){
    this.date.setHours(0, 0, 0, 0)
    let dateurl = this.url + '/notPaid?date=' + this.date//.toISOString()
    console.log(dateurl)
    this.http.get<Reserva[]>(dateurl).subscribe(data =>{ 
      this.reservations = Object.values(data);
      console.log(this.reservations);
    });
    //this.dateChanged();
    /*this.http.get<Reserva[]>(this.url).subscribe(data =>{ 
      this.reservations = Object.values(data);
      console.log(this.reservations);
    });*/
  }
  notaExists(res:Reserva){
    return res.notas!= ""
  }
  goToComandasPage(res:Reserva){
    /*console.log(this.reserve);
    this.sentOrder.setOrder(this.order);
    console.log(this.sentOrder)*/
    this.reservation.setReservation(res);
    this.router.navigate(['/comandas'])
  }

  modifyReservation(res: Reserva){
    this.reservation.setReservation(res);
    this.router.navigate(['/newreserva']);
  }
  deleteReservation(res: Reserva){
    //delete http in angular?
    const ref =this.dialog.open(ConfirmModalComponent,{ data: {
      message:  '¿Está seguro que desea eliminar la reserva de ' + res.clientName//or
    }});
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        let delete_url = this.url + '/' + res._id;
        console.log(delete_url);
        this.http.delete(delete_url)
        .subscribe(() => this.getReservas());
      }
    });
  }  

  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    
    this.getReservas()
    //this.events.push(`${type}: ${event.value}`);
  }
  openRecibo(res:Reserva){
    const ref =this.dialog.open(ReciboModalComponent,{ data: {
      message:  res//or
    }});
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getReservas();
      }
    });
  }
  ngOnInit(): void {
    //this.subscription = this.reservation.reserve.subscribe(reserve => this.reserve = reserve)
    this.getReservas();
  }
  totalEqualsZero(res:Reserva){
    return res.total === 0;
  }

}
