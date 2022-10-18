import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reserva } from '../models/reserva.model';
import { Venta } from '../models/venta.model';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit {
  change = 0.00;
  paidAmount!: number;
  paymentMethod = '';
  total=0;
  venta:Venta = {};
  reservation : Reserva ={};
  ventas_url="https://la-jatata.herokuapp.com/ventas"
  reservas_url="https://la-jatata.herokuapp.com/reservas"

  constructor(public http: HttpClient,private  dialogRef:  MatDialogRef<PaymentModalComponent>, @Inject(MAT_DIALOG_DATA) public  data:  any,private  dialog:  MatDialog) { 
    this.total = data.message.total;
    this.reservation = data.message;
  }
  buttonNotEnabled(){
    return this.paymentMethod==='' || (this.paidAmount <this.total || this.paidAmount ===undefined)
  }
  ngOnInit(): void {
  }
  confirmSale(){
    this.venta ={
      'date' : this.reservation.date,
      'clientName' : this.reservation.clientName,
      'total' : this.reservation.total,
      'paymentMethod' : this.paymentMethod,
      'products' : this.reservation.products,
    }
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
    const delete_url = this.reservas_url + "/" + this.reservation._id
    this.http.post(this.ventas_url, JSON.stringify(this.venta), httpOptions)
          .subscribe(data => console.log(data));
    this.http.delete(delete_url).subscribe(data => console.log(data));
    console.log(delete_url)
    this.dialogRef.close(true);
    }

  paymentMethodChanged(){
    if(this.paymentMethod === "Transferencia" || this.paymentMethod === "Tarjeta"){
      this.paidAmount = this.total;
    }
  }
}
