import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { OrderService } from '../services/order-service/order.service';


@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.component.html',
  styleUrls: ['./comandas.component.scss']
})
export class ComandasComponent implements OnInit {
  order: Order[] = []
  constructor(private receivedOrder: OrderService) {
      this.order = receivedOrder.getOrder()
      console.log(this.order)
   }

  ngOnInit(): void {

  }

}
