import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Product } from '../models/product.model';
import { NewproductModalComponent } from '../newproduct-modal/newproduct-modal.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

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
category: string='PLATOS';
searchValue = '';
products_url = 'https://la-jatata.herokuapp.com/products'


  constructor(public http: HttpClient,private  dialog:  MatDialog, private  router:  Router) { }

  ngOnInit(): void {
  }
  openDialog(){
    const ref =this.dialog.open(NewproductModalComponent)
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getProducts();
      }
    });
  }
  editProduct(pro:Product){
    const ref =this.dialog.open(NewproductModalComponent,{ data: {
      message:  pro//or
    }}); 
    
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        Swal.fire(
          'Editado exitosamente!',
          'Se ha editado el producto correctamente',
          'success'
        )
        this.getProducts();
      }
    });
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
  filterProducts(searchValue:string){
    let url;
    if(searchValue ===''){
      this.getProducts();
    }
    else{
      url = this.products_url + '/filter?search='+ this.searchValue;
      this.http.get<Product[]>(url).subscribe(data =>{ 
        this.products = Object.values(data);
        //this.allProducts = this.products;
        console.log(this.products);
      });
    }
  }

  changeSearchValue(){
    if (this.searchValue ===''){
      this.getProducts();
    } 
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
  deleteProduct(pro:Product){
    const ref =this.dialog.open(ConfirmModalComponent,{ data: {
      message:  '¿Está seguro que desea eliminar el producto ' + pro.name//or
    }});
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        let delete_url = this.products_url + '/' + pro._id;
        console.log(delete_url);
        this.http.delete(delete_url)
        .subscribe(() => this.getProducts());
      }
    });
  }

}
 