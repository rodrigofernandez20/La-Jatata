import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { queue } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import $ from "jquery";
import { QuantityModalComponent } from '../quantity-modal/quantity-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { OrderService } from '../services/order-service/order.service';


@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {

  title = 'la-jatata';
  actualPrice: number=0;
  total: number=0.00;
  categories= [{
    'name':'PLATOS',
    'active':false
  },
  {
    'name':'BEBIDAS',
    'active':false
  },
  {
    'name':'TRAGOS',
    'active':false
  },
  {
    'name':'LACTEOS',
    'active':false
  }
]
  products: Product[] = []; // Guarda productos por categoria
  allProducts:Product[] = []; // Guarda todos los productos
  order: Order[] = []/*[{
    'id':1,
    'product':'Sopa de Mani',
    'quantity':6,
    'price': 15,
    'subtotal': 90
  },
  {
    'id':2,
    'product':'Lechon',
    'quantity':2,
    'price': 55,
    'subtotal': 110
  }
]*/

  url = 'https://la-jatata.herokuapp.com/products'

  constructor(private sentOrder:OrderService, public http: HttpClient,private  dialog:  MatDialog, private  router:  Router,private snackBar: MatSnackBar){
    this.getProducts();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getProducts(){
    //let product = [{"name": 'Sopa de Mani',"price":15},{"name": 'Picante Mixto',"price":60},{"name": 'Pato al Vino',"price":80}, {"name": 'Pato Dorado',"price":60},{"name": 'Laping',"price":70},{"name": 'Picante de Lengua',"price":65}]
   //this.products = product;
    this.http.get<Product[]>(this.url).subscribe(data =>{ 
      this.products = Object.values(data);
      this.allProducts = this.products;
      console.log(this.products);
    });
  }

  goToComandasPage(){
    this.sentOrder.setOrder(this.order);
    console.log(this.sentOrder)
    this.router.navigate(['/comandas'])
  }
  changeCategory(cat:any){
    for(let i = 0; i < this.categories.length; i++){
      this.categories[i].active = false;
    }
    cat.active = !cat.active;
    this.products =this.allProducts.filter(x=> x.category == cat.name)
    
  }
   /* $( '.categories' ).find( 'a.active' )
            .removeClass( 'active' );
            $( this ).parent( 'a' ).addClass( 'active' );*/
  postProducts(){
    let product = {
      "day": 'Ambos',
      "id": 1,
      "id_categoria": 1,
      "price":15,
      "name": 'Sopa de Mani'
    }
    this.http.post<any>(this.url,JSON.stringify(product)).subscribe(data =>{ 
      console.log(data);
    });
  }
  // Esta funcion abre el quantity popup y verifica si ya existe en la orden el producto
  openDialog(pro: Product){
    if(this.order.some(e => e.name === pro.name)){
      const snack = this.snackBar.open('Este Producto ya se encuentra en la reserva',"Cerrar");
    }
    else{
    //Chequear si el item ya existe, si es que ya existe enviar un mensaje
      const ref =this.dialog.open(QuantityModalComponent,{ data: {
        message:  pro,
        quantity: 1
        }});
      const sub = ref.componentInstance.onAdd.subscribe((data) => {
        console.log(data);
        this.actualPrice = pro.price!
        this.order.push({
          "id":1, //Acomodar ID
          "name":pro.name,
          "quantity":data,
          "subtotal": this.actualPrice*data
        })
        this.total +=this.actualPrice*data;
      });
    }
  }
  //Cuando se presiona el boton de editar
  editClicked(or:Order){
    const ref =this.dialog.open(QuantityModalComponent,{ data: {
      message:  or,
      quantity: or.quantity
      }});
      const price = or.subtotal!/ or.quantity!
      const sub = ref.componentInstance.onAdd.subscribe((data) => {
        
        this.total -= or.subtotal!
        or.quantity = data
        let itemFound =this.order.find(item => item.name == or.name)
        itemFound!.quantity = data;
        itemFound!.subtotal = or.quantity! * price//this.order.find(item => item.id == or.id)!.quantity = data;
        this.total += or.quantity! * price
      });
  }
  //Cuando se presiona el boton delete
  deleteClicked(or:Order){
    const ref =this.dialog.open(ConfirmModalComponent,{ data: {
      message:  or
    }});
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.order = this.order.filter(item => item != or);
        this.total -= or.subtotal!
      }
    });
    
  }

    /*return new Promise(resolve=>{
      this.http.get("https://ucb-sit-backend-donations-app.herokuapp.com/api/proposals/user").subscribe(data=>{
          this.products = data;
      },error=>{
        console.log(error);
      });
    });
  }*/

}
