import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Comanda } from '../models/comanda.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { Reserva } from '../models/reserva.model';
import { QuantityModalComponent } from '../quantity-modal/quantity-modal.component';
import { OrderService } from '../services/order-service/order.service';
import { ReservationService } from '../services/reservation.service';
import { ComandaOrder } from '../models/comandaorder.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.component.html',
  styleUrls: ['./comandas.component.scss']
})


export class ComandasComponent implements OnInit {
  //order: Order[] = []
  reserva: Reserva =new Reserva;
  notes= '';
  comanda: Comanda = new Comanda;
  subscription: Subscription = new Subscription;
  previousComandas: Comanda[] = []
  url_comandas = 'https://la-jatata.herokuapp.com/comandas'
  products =[{
    'name':'Silpancho',
    'quantity': 2
  },
  {
    'name':'Sopa',
    'quantity': 3
  }
] 

  constructor(private  router:  Router,public http: HttpClient,private reservation: ReservationService,private  dialog:  MatDialog,private snackBar: MatSnackBar) {
      /*this.order = receivedOrder.getOrder()
      console.log(this.order)*/
      this.comanda.id_reserva = this.reserva._id;
      this.comanda.status = "Pendiente"
      this.comanda.products = [];
      
   }

  ngOnInit(): void {
    this.subscription = this.reservation.reserve.subscribe(reserve => this.reserva = reserve);
    this.comanda.id_reserva = this.reserva._id;
    let id_reserva_url = this.url_comandas + '?id_reserva=' + this.reserva._id;
    this.http.get<Comanda[]>(id_reserva_url).subscribe(data =>{ 
      this.previousComandas = Object.values(data);
      this.checkOtherComandas();
    });
  }
  checkOtherComandas(){
    for(let k =0;k<=this.reserva.products!.length;k++){
      let sentQuantity =0;
      let receivedQuantity =0;
      //let pendant = 0;
      if(this.previousComandas.length != 0){
        for(let i =0;i<this.previousComandas.length;i++){
          for(let j =0;j<this.previousComandas[i].products!.length;j++){
            if(this.previousComandas[i].products![j].product_id === this.reserva.products![k].product_id){
              sentQuantity += this.previousComandas[i].products![j].quantity!;
              if(this.previousComandas[i].products![j].state === "Entregado"){
                receivedQuantity += this.previousComandas[i].products![j].quantity!;
              }
            }
          }
        }
      }
      this.reserva.products![k].sentQuantity = sentQuantity;
      this.reserva.products![k].receivedQuantity = receivedQuantity;
      this.reserva.products![k].pendant = this.reserva.products![k].quantity! - sentQuantity ;
    }
    //return sentQuantity;
  }

  sendComanda(){
    if(this.comanda.products!.length >0){
      if(this.notes != ""){this.comanda.notes = this.notes;}
      this.postComanda();
      Swal.fire(
        '¡Creado exitosamente!',
        'Se ha enviado la comandas correctamente',
        'success'
      )
      this.router.navigate(['/reservas']);
    }
    else{
      const snack = this.snackBar.open('Debe agregar al menos un producto a la comanda',"Cerrar");
    }
  }
  postComanda(){
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
  
    this.http.post(this.url_comandas, JSON.stringify(this.comanda), httpOptions)
          .subscribe(data => console.log(data));
    }
  comandaIsAble(){
    return this.comanda.products!.length >0
  }
  /*checkOtherComandas(product_id?:number){
    let sentQuantity =0;
    if(this.previousComandas.length != 0){
      for(let i =0;i<this.previousComandas.length;i++){
        for(let j =0;j<this.previousComandas[i].products!.length;j++){
          if(this.previousComandas[i].products![j].product_id === product_id){
            sentQuantity += this.previousComandas[i].products![j].quantity!;
          }
        }
      }
    }
    return sentQuantity;
  }*/
  //Thinkabout how to use this method to fill the other columns, Entregado y pendiente. 
  // Maybe add this 3 numbers to each order in the reserva, but idk

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  noItemsLeft(or:Order){
    return or.pendant ===0;
  }

  deleteProduct(pro: ComandaOrder ){
    const ref =this.dialog.open(ConfirmModalComponent,{ data: {
      message:  '¿Está seguro que desea eliminar ' + pro.product_name//or
    }});
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.comanda.products!.splice(this.comanda.products!.indexOf(pro),1);
        this.reserva.products!.find(e =>e.product_id === pro.product_id)!.sentQuantity! -= pro.quantity!
        this.reserva.products!.find(e =>e.product_id === pro.product_id)!.pendant! += pro.quantity!
      }
    });
      
  }

  openDialog(or:Order){
    if(this.comanda.products!.some(e => e.product_id === or.product_id)){
      const snack = this.snackBar.open('Este Producto ya se encuentra en la comanda',"Cerrar");
    } 
    else{
      const ref =this.dialog.open(QuantityModalComponent,{ data: {
        message:or,
        quantity: 1,
        maxquantity: or.pendant
        }});

        ref.afterClosed().subscribe((quantity: number) => {
          if (quantity !=undefined) {
            let orderComanda : ComandaOrder = {
              'product_id' : or.product_id,
              'product_name': or.product_name,
              'quantity': quantity,
              'state': "Pendiente"
            }
            or.sentQuantity!+=quantity;
            or.pendant = or.quantity! - or.sentQuantity!;
            this.comanda.products!.push(orderComanda);
            console.log(this.comanda)
          } 
        });
    }
  }
}
