import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Reserva } from '../models/reserva.model';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-reserva-modal',
  templateUrl: './reserva-modal.component.html',
  styleUrls: ['./reserva-modal.component.scss']
})
export class ReservaModalComponent implements OnInit {
  //validators: FormGroup = new FormGroup({});
  form: FormGroup = new FormGroup({});
  subscription: Subscription = new Subscription;
  message: Reserva = new Reserva();
  reservations_url ='https://la-jatata.herokuapp.com/reservas'
  isSubmitted = false;
  
  constructor(public http: HttpClient,private  dialogRef:  MatDialogRef<ReservaModalComponent>,private fb: FormBuilder, private reservation:ReservationService,private  router:  Router,@Inject(MAT_DIALOG_DATA) public  data:  any) {
    if(data){
      /*this.form = this.fb.group({
        clientName: new FormControl(data.message.clientName,Validators.required),
        num_people: data.message.num_people,
        date: new FormControl(data.message.date,Validators.required),
        zone: data.message.zone,
        notas: data.message.notas
      });*/
      this.form = this.fb.group({
        clientName: [data.message.clientName,[Validators.required]],
        num_people: data.message.num_people,
        date: [data.message.date,[Validators.required]],
        zone: data.message.zone,
        notas: data.message.notas,
        
      });
    }
    else{
      this.form = this.fb.group({
        clientName: ['',[Validators.required]],//new FormControl([null],Validators.required),
        num_people: '',
        date: ['',[Validators.required]],//new FormControl([null],Validators.required),
        zone: '',
        notas: ''
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
    this.subscription = this.reservation.reserve.subscribe(reserve => this.reserve = reserve);
    /*this.validators = this.fb.group({
      clientName: ['', [Validators.required]],
      date: ['', [Validators.required]]
    });*/
    /*this.form = this.fb.group({
      clientName: [null],
      num_people: [null],
      date: [null],
      zone: [null],
      notas: [null]
    });*/
  }
  zones = ['Jatata 1', 'Jatata Grande',
            'Jatata Jardin','Jatata Nueva', 'Jardin','Terevinto 1','Terevinto 2','Sauce'];

  //model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
  reserve:Reserva = new Reserva;
  submitted = false;
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
      var res : Reserva ={
          'clientName': form.value.clientName,
          'date':form.value.date,
          'num_people':form.value.num_people,
          'zone':form.value.zone,
          'notas':form.value.notas,
          'products':[],
          'waiterName':''
      }
      console.log(res); 
      this.reservation.setReservation(res);
      this.router.navigate(['/newreserva']);
      this.closePopUp();
    }
     //this.reservation.setOrder(res);
  }
  onEditAccepted(form:any){
    var res : Reserva ={
      'clientName': form.value.clientName,
      'date':form.value.date,
      'num_people':form.value.num_people,
      'zone':form.value.zone,
      'notas':form.value.notas,
      'products':[]
   }
   this.closeAndSendReservation(res);
  }
  get errorControl() {
    return this.form.controls;
  } 
  saveReservation(form:any){
    this.isSubmitted = true;
    if (!this.form.valid) {
      console.log('Please provide all the required values!')
      //return false;
    }
    else{
      var res : Reserva ={
        'clientName': form.value.clientName,
        'date':form.value.date,
        'num_people':form.value.num_people,
        'zone':form.value.zone,
        'notas':form.value.notas,
        'products':[],'waiterName':''
      }
      this.postReservation(res);
      this.dialogRef.close();
      Swal.fire(
        '¡Creado exitosamente!',
        'Se ha creado la reserva correctamente',
        'success'
      )
      this.router.navigate(['/reservas']);
    }
  }

  postReservation(res:Reserva){
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
  
    this.http.post(this.reservations_url, JSON.stringify(res), httpOptions)
          .subscribe(data => console.log(data));
  }

  closeAndSendReservation(res:Reserva){
    this.dialogRef.close(res);
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

  /////////////////////////////

}
