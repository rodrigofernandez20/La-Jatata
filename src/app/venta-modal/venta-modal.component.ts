import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { Venta } from '../models/venta.model';

@Component({
  selector: 'app-venta-modal',
  templateUrl: './venta-modal.component.html',
  styleUrls: ['./venta-modal.component.scss']
})
export class VentaModalComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isSubmitted = false;
  category ='';
  products : Product[] =[];
  product :Product = {};
  quantity = ''
  //order: Order[]=[];
  categories = ['PLATOS', 'BEBIDAS',
  'BEBIDAS ALCOHOLICAS','LACTEOS','OTROS'];
  products_url = 'https://la-jatata.herokuapp.com/products'
  ventas_url = 'https://la-jatata.herokuapp.com/ventas'
  venta :Venta = {
    'date':new Date(),
    'clientName': 'Sin nombre',
    'paymentMethod': 'Efectivo',
    'total':0,
    'products':[]
  };

  constructor(public http: HttpClient,private fb: FormBuilder,private  dialogRef:  MatDialogRef<VentaModalComponent>) {
    this.form = this.fb.group({
      product_name: ['',[Validators.required]],//new FormControl([null],Validators.required),
      quantity: ['',[Validators.required]],
      category: ['',[Validators.required]]//new FormControl([null],Validators.required),
    });
   }

  ngOnInit(): void {
  }
  notReady(){
    return this.quantity === "" || this.product === undefined || this.category === "";
  }
  addToOrder(){
    let order: Order ={
      'product_name' : this.product.name,
      'quantity' : parseInt(this.quantity),
      'total' : this.product.price! * parseInt(this.quantity)
    }
    this.venta.total! +=this.product.price! * parseInt(this.quantity)
    this.venta.products!.push(order);
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
  closePopup(){
  this.dialogRef.close(true);
  }
  isEmpty(){
    return this.venta.products!.length ===0
  }
  postVenta(){
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
    this.http.post(this.ventas_url, JSON.stringify(this.venta), httpOptions)
          .subscribe(data => {
            console.log(data);
            Swal.fire(
              '¡Creado exitosamente!',
              'La venta rapida ha sido registrada',
              'success'
            )
            this.closePopup();
          });
  }
}
