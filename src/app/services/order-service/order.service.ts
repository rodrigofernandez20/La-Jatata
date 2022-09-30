import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public order: Order[] = []

  constructor() { }
  public getOrder(): Order[] {
    return this.order;
  }

  public setOrder(order: any): void {
      this.order = order;
    }
} 
