import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Reserva } from '../models/reserva.model';

@Component({
  selector: 'app-allreservas',
  templateUrl: './allreservas.component.html',
  styleUrls: ['./allreservas.component.scss']
})
export class AllreservasComponent implements OnInit {

  reservations: Reserva[] = [];
  url = 'https://la-jatata.herokuapp.com/reservas'

  constructor(public http: HttpClient,private  dialog:  MatDialog) {
    //this.getReservas();
   }
   getReservas(){
    //let product = [{"name": 'Sopa de Mani',"price":15},{"name": 'Picante Mixto',"price":60},{"name": 'Pato al Vino',"price":80}, {"name": 'Pato Dorado',"price":60},{"name": 'Laping',"price":70},{"name": 'Picante de Lengua',"price":65}]
   //this.products = product;
    this.http.get<Reserva[]>(this.url).subscribe(data =>{ 
      this.reservations = Object.values(data);
      console.log(this.reservations);
    });
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
    /*
    let delete_url = this.url + '/' + res._id;
    console.log(delete_url);
    this.http.delete(delete_url)
    .subscribe(() => this.getReservas());*/
  }  

  ngOnInit(): void {
    this.getReservas();
  }

}
