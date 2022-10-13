import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from  '@angular/material/dialog';


@Component({
  selector: 'app-quantity-modal',
  templateUrl: './quantity-modal.component.html',
  styleUrls: ['./quantity-modal.component.scss']
})
export class QuantityModalComponent implements OnInit {
  quantity: number=1;
  product: string ="";
  maxquantity: number = 100;

  onAdd = new EventEmitter();
 
  constructor(private  dialogRef:  MatDialogRef<QuantityModalComponent>, @Inject(MAT_DIALOG_DATA) public  data:  any) {
    this.product = data.message.name;
    this.quantity = data.quantity;
    if(data.maxquantity >0){
      this.maxquantity = data.maxquantity;
    }
  }
  
  ngOnInit(): void {
  }
  valuechange(newValue: any) {
    this.quantity= parseInt(newValue.target.value)
  }
  plus(){
    if(this.quantity<this.maxquantity){
      this.quantity+=1;
    }
  }
  minus(){
    if(this.quantity>1){
      this.quantity-=1;
    } 
  }
  closePopUp() {
    this.dialogRef.close();
  }

  confirmClicked(){
    this.onAdd.emit(this.quantity);
    this.dialogRef.close(this.quantity);
  }

}
