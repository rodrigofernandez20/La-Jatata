import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit,AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { MenuItem } from '../models/menu-item.model';
import { Menu } from '../models/menu.model';
import { Product } from '../models/product.model';
import { Reserva } from '../models/reserva.model';
import { QuantityModalComponent } from '../quantity-modal/quantity-modal.component';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {

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
  products: Product[] = [];
  reservations: Reserva[] = [];
  menu: Menu ={}
  category: string='PLATOS';
  date:Date = new Date();
  products_url = 'https://la-jatata.herokuapp.com/products'
  menu_url ='https://la-jatata.herokuapp.com/menu'
  reservations_url ='https://la-jatata.herokuapp.com/reservas'
  modifyCalled = false;

  constructor(private snackBar: MatSnackBar,private  dialog:  MatDialog,public http: HttpClient) { 
    this.getReservations();
  }
  
  ngOnInit(): void {
    this.menu.products =[]
    this.getProducts();
    this.getMenu();
    this.getReservations();
   // this.fillReservated();
  }
    getReservations(){
      let url = this.reservations_url + '?date='+ this.date
      this.http.get<Reserva[]>(url).subscribe(data =>{ 
        this.reservations = Object.values(data);
        this.fillReservated();
      });
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

  openDialog(pro: Product){
    if(this.menu.products?.some(e => e.product_id === pro._id)){
      const snack = this.snackBar.open('Este Producto ya se encuentra en el menu',"Cerrar");
    } 
    else{
    //Chequear si el item ya existe, si es que ya existe enviar un mensaje
      const ref =this.dialog.open(QuantityModalComponent,{ data: {
        message:  pro,
        quantity: 1
        }});
      const sub = ref.componentInstance.onAdd.subscribe((data) => {
        console.log(data);
        const item:MenuItem ={
          'product_id':pro._id,
          'product_name':pro.name,
          'prepared':data,
          'available':data,
          'reservated': this.getReservated(pro._id!),
          'delivered':0,
        }
        this.menu.products?.push(item);
      });
    }
  }
  fillReservated(){
    for(let i =0;i<this.menu.products!.length;i++){
      this.menu.products![i].reservated= this.getReservated(this.menu.products![i].product_id!)
    }
  }
  getMenu(){
    this.date.setHours(0, 0, 0, 0);
    let dateurl = this.menu_url + '?date=' + this.date.toISOString()
    console.log(dateurl)
    this.http.get<Menu[]>(dateurl).subscribe(data =>{ 
       if(Object.values(data).length !=0){  
        this.modifyCalled = true;
        this.menu = data[0];
        //this.fillReservated();
       }
       else{
        this.modifyCalled = false;
        this.menu = {'products':[]}
       }
       console.log(this.menu);
      console.log(this.modifyCalled);
    });
  }

  dateChanged(){
    this.getMenu();
    this.getReservations()
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

  saveMenu(){
    if(this.menu.products?.length === 0){
      const snack = this.snackBar.open('Debe existir al menos un producto en el menu',"Cerrar");
    }
    else{
      if(!this.modifyCalled){
        this.menu.date = this.date;
        this.postMenu();
      }
      else{
        this.modifyMenu();
      }
    }
    
  }

  modifyMenu(){
    const patch_url = this.menu_url + '/' + this.menu._id;
    const products = {'products': this.menu.products}
    this.http.patch(patch_url,products)
    .subscribe(data => console.log(data));
    Swal.fire(
      '¡Modificado exitosamente!',
      'Se han guardado los cambios en el menu',
      'success'
    )
  }
  postMenu(){
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
    this.http.post(this.menu_url, JSON.stringify(this.menu), httpOptions)
          .subscribe(data => console.log(data));
    Swal.fire(
      '¡Creado exitosamente!',
      'El Menu del dia ha sido creado correctamente',
      'success'
    )
    }
    editClicked(item:MenuItem){
      const ref =this.dialog.open(QuantityModalComponent,{ data: {
        message:  item,
        quantity: item.prepared
        }});
        //const price = or.total!/ or.quantity!
        const sub = ref.componentInstance.onAdd.subscribe((data) => {
          //this.reserve.total! -= or.total!
          item.prepared = data
          let itemFound =this.menu.products!.find(data => data.product_id == item.product_id)
          itemFound!.prepared = data;
          //itemFound!.total = or.quantity! * price//this.order.find(item => item.id == or.id)!.quantity = data;
          //this.reserve.total! += or.quantity! * price
        });
    }
    deleteClicked(item:MenuItem){
      const ref =this.dialog.open(ConfirmModalComponent,{ data: {
        message:  '¿Está seguro que desea borrar ' + item.product_name//or
      }});
      ref.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.menu.products = this.menu.products!.filter(data => data != item);
          //this.reserve.total! -= or.total!
        } 
      });
      
    }
  
}
