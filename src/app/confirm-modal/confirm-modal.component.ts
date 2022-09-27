import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  product: string ="";
  
  constructor(private  dialogRef:  MatDialogRef<ConfirmModalComponent>, @Inject(MAT_DIALOG_DATA) public  data:  any) {
    this.product = data.message.name;
   }

  ngOnInit(): void {
  }
  closePopUp() {
    this.dialogRef.close(false);
  }
  confirmClicked(){
   // this.onAdd.emit(this.quantity);
    this.dialogRef.close(true);
  }
}
