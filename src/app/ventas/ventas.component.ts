import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VentaModalComponent } from '../venta-modal/venta-modal.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  constructor(private  dialog:  MatDialog) { }

  ngOnInit(): void {
  }
  showForm(){
    const ref =this.dialog.open(VentaModalComponent)
  }
}
