import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Comanda } from '../models/comanda.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { Reserva } from '../models/reserva.model';
import { OrderService } from '../services/order-service/order.service';
import { ReservationService } from '../services/reservation.service';


@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.component.html',
  styleUrls: ['./comandas.component.scss']
})


export class ComandasComponent implements OnInit {
  //order: Order[] = []
  reserva: Reserva =new Reserva;
  comanda: Comanda = new Comanda;
  subscription: Subscription = new Subscription;
  previousComandas: Comanda[] = []
  url_comandas = 'https://la-jatata.herokuapp.com/comandas'
  

  constructor(public http: HttpClient,private reservation: ReservationService) {
      /*this.order = receivedOrder.getOrder()
      console.log(this.order)*/
   }

  ngOnInit(): void {
    this.subscription = this.reservation.reserve.subscribe(reserve => this.reserva = reserve);
    this.comanda.id_reserva = this.reserva._id;
    let id_reserva_url = this.url_comandas + '?id_reserva=' + this.reserva._id;
    this.http.get<Reserva[]>(id_reserva_url).subscribe(data =>{ 
      this.previousComandas = Object.values(data);
      console.log(this.previousComandas);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
 
}
