import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { queue, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import $ from "jquery";
import { QuantityModalComponent } from '../quantity-modal/quantity-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { OrderService } from '../services/order-service/order.service';
import { Reserva } from '../models/reserva.model';
import { ReservationService } from '../services/reservation.service';
import { ReservaModalComponent } from '../reserva-modal/reserva-modal.component';
import Swal from 'sweetalert2';
import { Menu } from '../models/menu.model';


@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {

  title = 'la-jatata';
  actualPrice: number=0;
  //total: number=0.00;
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
  //reservation: Reserva ={};
  subscription: Subscription = new Subscription;
  reserve:Reserva = new Reserva;
  reservations :Reserva[]=[];
  products: Product[] = []; // Guarda productos por categoria
  allProducts:Product[] = []; // Guarda todos los productos
  order: Order[] = [];
  menu: Menu={}
 
  products_url = 'https://la-jatata.herokuapp.com/products'
  reservations_url ='https://la-jatata.herokuapp.com/reservas'
  menu_url = 'https://la-jatata.herokuapp.com/menu'
  category: string='PLATOS';

  constructor(private reservation:ReservationService,private sentOrder:OrderService, public http: HttpClient,private  dialog:  MatDialog, private  router:  Router,private snackBar: MatSnackBar){
    this.getProducts();
  
  } 
  getMenu(){
    //let date:Date = new Date();
    //date.setHours(0, 0, 0, 0);
    //const dateName = this.reserve.date!.toISOString()
    let dateurl = this.menu_url + '?date=' + this.reserve.date
    console.log(dateurl)
    this.http.get<Menu[]>(dateurl).subscribe(data =>{ 
        this.menu = data[0];
        console.log(this.menu);
    });
  }
  ngOnInit(): void {
    //this.reserve.total = 0;
    this.subscription = this.reservation.reserve.subscribe(reserve => this.reserve = reserve);
    this.order = this.reserve.products!; 
    this.getMenu();
    this.getReservations();
    //console.log(this.reserve);
   // throw new Error('Method not implemented.');
  }
  getColor(id:number) { 
    let color ='';
    let cant = -1;
    if(this.menu!= undefined){
        let item = this.menu.products!.find(({product_id}) =>product_id === id)
        if(item!=undefined){
          cant = item.prepared! - item.reservated!
        }
    }
    if(cant==-1 || cant>15){
      color = '#036C02';
    }
    else if(cant<=15 && cant>0){
      color = '#FFC300';
    }
    else if (cant ===0){
      color= '#F37A5F';
    }
    return color;
  }
  getReservations(){
    let url = this.reservations_url + '?date='+ this.reserve.date
    this.http.get<Reserva[]>(url).subscribe(data =>{ 
      this.reservations = Object.values(data);
      this.fillReservated();
    });
  }
  fillReservated(){
    for(let i =0;i<this.menu.products!.length;i++){
      this.menu.products![i].reservated= this.getReservated(this.menu.products![i].product_id!)
    }
  }
  getReservated(product_id:number){
    let cantReservated = 0;
    for(let i =0;i<this.reservations.length;i++){
      for(let j =0;j<this.reservations[i].products!.length;j++){
        if(this.reservations[i].products![j].product_id === product_id){
          cantReservated+= this.reservations[i].products![j].quantity!
        }
      }
    }
    return cantReservated;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  idExists(){
    if(this.reserve._id! >= 1){
      return true;
    }
    else{
      return false;
    }
  }
  saveReservation(){
    //this.reserve.products
    let message = 'Se ha creado la reserva correctamente'
    this.reserve.products! = [];
    for (let i =0;i<this.order.length;i++){
      this.reserve.products!.push(this.order[i])
    }
    if(this.idExists()){
      this.updateReservation();
      message = 'Se ha editado la reserva correctamente'
    }
    else{
      this.postReservation();
    }
    Swal.fire(
      '¡Creado exitosamente!',
      message,
      'success'
    )
    //this.router.navigate(['/reservas']);
    this.router.navigateByUrl('/reservas');
    /*'product_id':this.order[i].product_id, //Acomodar ID
        "product_name":this.order[i].product_name,
        "quantity":this.order[i].quantity,
        "price":this.order[i].price,
        "total": this.order[i].total*/
    //this.reserve.products = orderToSave.values
  }
  updateReservation(){
    //http put angular?
    let updateUrl = this.reservations_url + '/'+ this.reserve._id;
    var res : Reserva ={
      'clientName': this.reserve.clientName,
      'date':this.reserve.date,
      'num_people':this.reserve.num_people,
      'zone':this.reserve.zone,
      'notas':this.reserve.notas,
      'products':this.reserve.products,
      'waiterName':this.reserve.waiterName,
      'total': this.reserve.total
   }
    console.log(JSON.stringify(res));
    return this.http.put<Reserva>(updateUrl, res).subscribe(data => console.log(data));

  }
  modifyReservation(){
    //this.reservation.setReservation(this.reserve);
    const ref =this.dialog.open(ReservaModalComponent,{ data: {
      message:  this.reserve//or
    }});
    ref.afterClosed().subscribe((res: Reserva) => {
      this.reserve.clientName = res.clientName;
      this.reserve.date = res.date;
      this.reserve.num_people = res.num_people;
      this.reserve.zone = res.zone;
      this.reserve.notas = res.notas;
    });
  }
  postReservation(){
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
  
    this.http.post(this.reservations_url, JSON.stringify(this.reserve), httpOptions)
          .subscribe(data => console.log(data));
  }
  getProducts(){
    //let product = [{"name": 'Sopa de Mani',"price":15},{"name": 'Picante Mixto',"price":60},{"name": 'Pato al Vino',"price":80}, {"name": 'Pato Dorado',"price":60},{"name": 'Laping',"price":70},{"name": 'Picante de Lengua',"price":65}]
   //this.products = product;
    let url = this.products_url + '?category='+ this.category
    console.log(url)
    this.http.get<Product[]>(url).subscribe(data =>{ 
      this.products = Object.values(data);
      //this.allProducts = this.products;
      console.log(this.products);
    });
  }
  goToComandasPage(){
    console.log(this.reserve);
    this.sentOrder.setOrder(this.order);
    console.log(this.sentOrder)
    this.router.navigate(['/comandas'])
  }
  changeCategory(cat:any){
    for(let i = 0; i < this.categories.length; i++){
      this.categories[i].active = false;
    }
    cat.active = !cat.active;
    if(cat.name ==="TRAGOS"){
      this.category = 'BEBIDAS ALCOHOLICAS';
    }
    else{
      this.category = cat.name;
    }
    //this.products =this.allProducts.filter(x=> x.category == cat.name)
    this.getProducts()
  }
  //post http in angular?




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
    this.http.post<any>(this.products_url,JSON.stringify(product)).subscribe(data =>{ 
      console.log(data);
    });
  }
  // Esta funcion abre el quantity popup y verifica si ya existe en la orden el producto
  openDialog(pro: Product){
    if(this.order.some(e => e.product_name === pro.name)){
      const snack = this.snackBar.open('Este Producto ya se encuentra en la reserva',"Cerrar");
    } 
    else{
      if(this.noProductLeft(pro._id!)){
        const snack = this.snackBar.open('Se ha agotado este producto',"Cerrar");
      }
      else{
        let max =this.getAvailableQuantity(pro._id!);
      const ref =this.dialog.open(QuantityModalComponent,{ data: {
        message:  pro,
        quantity: 1,
        maxquantity:max
        }});
      const sub = ref.componentInstance.onAdd.subscribe((data) => {
        console.log(data);
        this.actualPrice = pro.price!
        this.order.push({
          "product_id":pro._id, //Acomodar ID
          "product_name":pro.name,
          "quantity":data,
          "price":pro.price,
          "total": this.actualPrice*data
        })
        this.reserve.total! +=this.actualPrice*data;
      });
    }
    }
  }
  getAvailableQuantity(id: number){
    let quantity = 100;
    if(this.menu!=undefined){
      let menuItem =this.menu.products!.find(({product_id})=>product_id ===id)
      if(menuItem!=undefined){
        quantity = menuItem!.prepared! -menuItem!.reservated!;
      }
    }
    return quantity;
  }
  noProductLeft(id: number){
    let isZero = false;
    if(this.menu!=undefined){
      let menuItem =this.menu.products!.find(({product_id})=>product_id ===id)
      if(menuItem!=undefined){
        if(menuItem!.prepared! -menuItem!.reservated! ===0){
          isZero = true;
        }
      }
    }
    return isZero;
  }
  //Cuando se presiona el boton de editar
  editClicked(or:Order){
    let max =this.getAvailableQuantity(or.product_id!);
    const ref =this.dialog.open(QuantityModalComponent,{ data: {
      message:  or,
      quantity: or.quantity,
      maxquantity: or.quantity! + max
      }});
      const price = or.total!/ or.quantity!
      const sub = ref.componentInstance.onAdd.subscribe((data) => {
        
        this.reserve.total! -= or.total!
        or.quantity = data
        let itemFound =this.order.find(item => item.product_name == or.product_name)
        itemFound!.quantity = data;
        itemFound!.total = or.quantity! * price//this.order.find(item => item.id == or.id)!.quantity = data;
        this.reserve.total! += or.quantity! * price
      });
  }
  //Cuando se presiona el boton delete
  deleteClicked(or:Order){
    const ref =this.dialog.open(ConfirmModalComponent,{ data: {
      message:  '¿Está seguro que desea borrar ' + or.product_name//or
    }});
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.order = this.order.filter(item => item != or);
        this.reserve.total! -= or.total!
      } 
    });
    
  }


}
