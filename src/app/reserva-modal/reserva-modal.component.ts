import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Reserva } from '../models/reserva.model';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-reserva-modal',
  templateUrl: './reserva-modal.component.html',
  styleUrls: ['./reserva-modal.component.scss']
})
export class ReservaModalComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  subscription: Subscription = new Subscription;
  message: Reserva = new Reserva();
  reservations_url ='https://la-jatata.herokuapp.com/reservas'
  
  constructor(public http: HttpClient,private  dialogRef:  MatDialogRef<ReservaModalComponent>,private fb: FormBuilder, private reservation:ReservationService,private  router:  Router,@Inject(MAT_DIALOG_DATA) public  data:  any) {
    if(data){
      this.form = this.fb.group({
        clientName: data.message.clientName,
        num_people: data.message.num_people,
        date: data.message.date,
        zone: data.message.zone,
        notas: data.message.notas
      });
    }
    else{
      this.form = this.fb.group({
        clientName: [null],
        num_people: [null],
        date: [null],
        zone: [null],
        notas: [null]
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
    this.subscription = this.reservation.reserve.subscribe(reserve => this.reserve = reserve)
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
     var res : Reserva ={
        'clientName': form.value.clientName,
        'date':form.value.date,
        'num_people':form.value.num_people,
        'zone':form.value.zone,
        'notas':form.value.notas,
        'products':[]
     }
     console.log(res); 
     this.reservation.setReservation(res);
     this.router.navigate(['/newreserva']);
     this.closePopUp();
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

  saveReservation(form:any){
    var res : Reserva ={
      'clientName': form.value.clientName,
      'date':form.value.date,
      'num_people':form.value.num_people,
      'zone':form.value.zone,
      'notas':form.value.notas,
      'products':[]
   }
   this.postReservation(res);
   this.dialogRef.close();
   this.router.navigate(['/reservas']);
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
