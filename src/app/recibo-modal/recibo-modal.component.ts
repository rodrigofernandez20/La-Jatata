import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reserva } from '../models/reserva.model';

@Component({
  selector: 'app-recibo-modal',
  templateUrl: './recibo-modal.component.html',
  styleUrls: ['./recibo-modal.component.scss']
})
export class ReciboModalComponent implements OnInit {

  reservation : Reserva;
  amountConfirmed = false;
  methodConfirmed = false;
  change = 0.00;
  paidAmount!: number;
  paymentMethod = '';
  constructor(private  dialogRef:  MatDialogRef<ReciboModalComponent>, @Inject(MAT_DIALOG_DATA) public  data:  any) { 
    this.reservation = data.message;
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

}
