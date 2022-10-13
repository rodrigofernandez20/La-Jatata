import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import { ReservaModalComponent } from '../reserva-modal/reserva-modal.component';
import { ReservationService } from '../services/reservation.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-newproduct-modal',
  templateUrl: './newproduct-modal.component.html',
  styleUrls: ['./newproduct-modal.component.scss']
})
export class NewproductModalComponent implements OnInit {

  validators: FormGroup = new FormGroup({});
  form: FormGroup = new FormGroup({});
  subscription: Subscription = new Subscription;
  message: Product = new Product();
  products_url ='https://la-jatata.herokuapp.com/products'
  isSubmitted = false;
  categories = ['PLATOS', 'BEBIDAS',
            'BEBIDAS ALCOHOLICAS','LACTEOS'];
  days = ['SABADO', 'DOMINGO',
            'AMBOS'];
  _id :Number = 0;
  //model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
  submitted = false;
  
  constructor(public http: HttpClient,private  dialogRef:  MatDialogRef<ReservaModalComponent>,private fb: FormBuilder, private reservation:ReservationService,private  router:  Router,@Inject(MAT_DIALOG_DATA) public  data:  any) {
    if(data){
      this._id = data.message._id;
      this.form = this.fb.group({
        name: [data.message.name,[Validators.required]], 
        price: [data.message.price,[Validators.required]],
        category: [data.message.category,[Validators.required]],
        day: data.message.day
      });
    }
    else{
      this.form = this.fb.group({
        name: ['',[Validators.required]],//new FormControl([null],Validators.required),
        price: ['',[Validators.required]],
        category: ['',[Validators.required]],//new FormControl([null],Validators.required),
        day: ['',[Validators.required]],
      });
    }
   }
  modifyDataExists()
  {
    if(this.data){
      return true;
    }
    else{
      return false;
    }
  }
  ngOnInit(): void {
    //this.subscription = this.reservation.reserve.subscribe(reserve => this.reserve = reserve);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onSubmit(form:any){
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(form.value, null, 4));
    this.isSubmitted = true;
    if (!this.form.valid) {
      console.log('Please provide all the required values!')
      //return false;
    }
    else{
      var pro : Product ={
          'name': form.value.name,
          'price':form.value.price,
          'category':form.value.category,
          'day':form.value.day
      }
      console.log(pro); 
      //this.reservation.setReservation();
      this.router.navigate(['/newreserva']);
      this.closePopUp();
    }
     //this.reservation.setOrder(res);
  }
  onEditAccepted(form:any){
    var pro : Product ={
      'name': form.value.name,
      'price':form.value.price,
      'category':form.value.category,
      'day':form.value.day
   }
   this.updateReservation(pro);
   this.dialogRef.close(true);
  }

  updateReservation(pro:Product){
    //http put angular?
    console.log(pro)
    let updateUrl = this.products_url + '/'+ this._id;
    var res : Product ={
      'name': pro.name,
      'price':pro.price,
      'category':pro.category,
      'day':pro.day
   }
    console.log(updateUrl)
    console.log(JSON.stringify(res));
    return this.http.put<Product>(updateUrl, res).subscribe(data => console.log(data));

  }

  get errorControl() {
    return this.form.controls;
  } 
  saveProduct(form:any){
    this.isSubmitted = true;
    if (!this.form.valid) {
      console.log(form.value.category)
      console.log(form.value.name)
      console.log(form.value.price)
      //return false;
    }
    else{
      var pro : Product ={
        'name': form.value.name,
        'price':form.value.price,
        'category':form.value.category,
        'day':form.value.day
     }
      this.postProduct(pro);
      this.dialogRef.close(true);
      Swal.fire(
        '¡Creado exitosamente!',
        'Se ha creado el producto correctamente',
        'success'
      )
      // this.router.navigate(['/reservas']);
    }
  }

  postProduct(pro:Product){
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
  
    this.http.post(this.products_url, JSON.stringify(pro), httpOptions)
          .subscribe(data => console.log(data));
  }


  closePopUp() {
    this.dialogRef.close(false);
  }


  /*newHero() {
    this.model = new Hero(42, '', '');
  }*/

  /*skyDog(): Hero {
    const myHero =  new Hero(42, 'SkyDog',
                           'Fetch any object at any distance',
                           'Leslie Rollover');
    console.log('My hero is called ' + myHero.name); // "My hero is called SkyDog"
    return myHero;
  }*/

  //////// NOT SHOWN IN DOCS ////////

  // Reveal in html:
  //   Name via form.controls = {{showFormControls(heroForm)}}
  showFormControls(form: any) {
    return form && form.controls.name &&
    form.controls.name.value; // Dr. IQ
  }


}
