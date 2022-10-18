import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Reserva } from '../models/reserva.model';
import { Venta } from '../models/venta.model';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';

@Component({
  selector: 'app-recibo-modal',
  templateUrl: './recibo-modal.component.html',
  styleUrls: ['./recibo-modal.component.scss']
})
export class ReciboModalComponent implements OnInit {

  reservation : Reserva;
  venta : Venta = {};
  amountConfirmed = false;
  methodConfirmed = false;
  change = 0.00;
  paidAmount!: number;
  paymentMethod = '';
  paymentEnabled =false;

  constructor(private  dialogRef:  MatDialogRef<ReciboModalComponent>, @Inject(MAT_DIALOG_DATA) public  data:  any,private  dialog:  MatDialog) { 
    this.reservation = data.message;
  }
  goToPayment(){
    const ref =this.dialog.open(PaymentModalComponent,{ data: {
      message:  this.reservation//or
    }});
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        Swal.fire(
          '¡Cancelado exitosamente!',
          'Se ha procesado correctamente el pago',
          'success'
        )
        this.dialogRef.close(true);
      }
    });
  }
  confirmAmount(){
    this.amountConfirmed = true;
    this.change =  this.paidAmount -this.reservation.total!
  }
  confirmMethod(){
    this.methodConfirmed = true;
    //this.change = this.reservation.total! - this.paidAmount
  }
  notEnough(){
    return this.paidAmount<this.reservation.total! || this.paidAmount === undefined
  }
  printReceipt(){
    document.getElementById("pay-button")!.style.visibility = "hidden";
    document.getElementById("print-button")!.style.visibility = "hidden";
    window.print();
    document.getElementById("pay-button")!.style.visibility = "visible";
    document.getElementById("print-button")!.style.visibility = "visible";
  }
  printEnabled(){
    return !this.amountConfirmed || !this.methodConfirmed
  }
  methodEmpty(){
    return this.paymentMethod ===''
  }
  ngOnInit(): void {
  }
  payAccount(){
    this.paymentEnabled = true;
    /*this.venta ={
      'date' : this.reservation.date,
      'clientName' : this.reservation.clientName,
      'total' : this.reservation.total,
      //'paymentMethod' : this.reservation.paymentMethod,
      'products' : this.reservation.products,
    }*/
  }
}
