import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
 
  private messageSource = new BehaviorSubject(new Reserva);
  reserve = this.messageSource.asObservable();
  //existingReservation = false;
  //public reserve: Reserva[] = []

  constructor() { }
  /*public getOrder(): Reserva[] {
    return this.reserve;
  }*/

  public setReservation(reserva: any): void {
    this.messageSource.next(reserva)
  }
  
}
