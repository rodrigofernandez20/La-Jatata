import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Reserva } from '../models/reserva.model';
import { Waiter } from '../models/waiter.model';

@Component({
  selector: 'app-waiters',
  templateUrl: './waiters.component.html',
  styleUrls: ['./waiters.component.scss']
})
export class WaitersComponent implements OnInit {
  reservations: Reserva[] = [];
  waiters: Waiter[] =[];
  zones = ['Jatata 1', 'Jatata Grande',
            'Jatata Jardin','Jatata Nueva', 'Jardin','Terevinto 1','Terevinto 2','Sauce'];

  date: Date = new Date();
  reservations_url = 'https://la-jatata.herokuapp.com/reservas'
  waiters_url = 'https://la-jatata.herokuapp.com/meseros'
  selectedWaiter ="Todos";
  selectedZone ="Todos";

  constructor(public http: HttpClient,private  dialog:  MatDialog,private snackBar: MatSnackBar) { }


  getReservas(){
    this.date.setHours(0, 0, 0, 0);
    let apiurl="";
    if(this.selectedWaiter === "Todos" && this.selectedZone === "Todos"){
      apiurl = this.reservations_url + "?date=" +this.date//.toISOString();
    }
    else if(this.selectedWaiter === "Sin Asignar"){
      apiurl = this.reservations_url + "/zones?date=" + this.date/*.toISOString()*/ + "&waiter=" ;
      if(this.selectedZone != "Todos"){
        apiurl += "&zone=" + this.selectedZone;
      }
    }
    else if(this.selectedWaiter === "Todos"){
      apiurl = this.reservations_url + "/zones?date=" + this.date.toISOString() + "&zone=" + this.selectedZone;
    }
    else if(this.selectedZone === "Todos"){
      apiurl = this.reservations_url + "/zones?date=" + this.date.toISOString() + "&waiter=" + this.selectedWaiter;
    }
    else if(this.selectedWaiter != "Todos" && this.selectedZone != "Todos"){
      apiurl = this.reservations_url + "/zones?date=" + this.date.toISOString() + "&zone=" + this.selectedZone + "&waiter=" + this.selectedWaiter;
    }
    //apiurl = this.reservations_url + "/" + "Sauce" + "/" +  this.date.toISOString();//'?date=' + this.date.toISOString() +"&zone=" + "Sauce" 
    console.log(apiurl)
    this.getApi(apiurl)
  }

  getApi(url:string){
    this.http.get<Reserva[]>(url).subscribe(data =>{ 
      this.reservations = Object.values(data);
      //console.log(this.reservations);
    });
  }

  getWaiters(){
    this.http.get<Reserva[]>(this.waiters_url).subscribe(data =>{ 
      this.waiters = Object.values(data);
      //console.log(this.reservations);
    });
  }
  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    
    this.getReservas()
    //this.events.push(`${type}: ${event.value}`);
  }
  ngOnInit(): void {
    this.getReservas();
    this.getWaiters();
  }
  searchButtonPressed(){
    this.getReservas()
  }
  waiterExists(res:Reserva){
    return res.waiterName != "";
  }
  assignWaiter(res:Reserva,mesero:String){
    const ref =this.dialog.open(ConfirmModalComponent,{ data: {
      message:  '¿Está seguro de asignar a ' + mesero + " a la reserva de " + res.clientName //or
    }});
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const patch_url = this.reservations_url + '/' + res._id;
        const waiter = {'waiterName': mesero}
        console.log(patch_url)
        console.log(waiter)
        this.http.patch(patch_url,waiter)
        .subscribe(() => this.getReservas());
        this.snackBar.open('La reserva fue asignada a ' + mesero,"Cerrar");
      }
    });
  }
//patch http typescript?
  patchReservation(url:string,waiter:String){
}
}
 