import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ComandaService } from '../comanda.service';
import { Comanda } from '../models/comanda.model';
import { Reserva } from '../models/reserva.model';
import { environment } from "../../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.scss']
})
export class CocinaComponent implements OnInit {
  comandas: Comanda[] = [];
  comandas_url = 'https://la-jatata.herokuapp.com/comandas'
  reservas_url = 'https://la-jatata.herokuapp.com/reservas'
  isComandaBeingCalled:boolean=false;
  message:any = null;

  constructor(public http: HttpClient, private comandaService:ComandaService) { 
    this.comandaService.isComandaBeingCalled.subscribe( value => {
      this.isComandaBeingCalled = value;
  });
  }
  /*subscribeToTopic(){
    getMessaging().subscribeToTopic("token", "topic")
  .then((response) => {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully subscribed to topic:', response);
  })
  .catch((error) => {
    console.log('Error subscribing to topic:', error);
  });
  }*/
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
           console.log(currentToken);
         } else {
           console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
      this.getComandas();
    });
  }

  ngOnInit(): void {
    this.getComandas();
    this.requestPermission();
    this.listen();
  }
  getComandas(){
    let date = new Date();
    //date.setHours(0, 0, 0, 0)
    let dateurl = this.comandas_url + '/date?date=' + date.toISOString()
    console.log(dateurl)
    this.http.get<Comanda[]>(dateurl).subscribe(data =>{ 
      this.comandas = Object.values(data);
      this.saveInformation();
      console.log(this.comandas);
    });
  }

  saveInformation(){
    let id_url ="";
    for(let i=0;i<this.comandas.length;i++){
      id_url = this.reservas_url + "/" + this.comandas[i].id_reserva;
      this.http.get<Reserva>(id_url).subscribe(data =>{ 
        this.comandas[i].clientName = data.clientName;
        this.comandas[i].waiterName = data.waiterName;
        this.comandas[i].zone = data.zone;
        //this.saveInformation();
        //console.log(this.comandas);
      });
    }
  }

  getTime(dat:Date){
    let date = new Date(dat);
    const hoursAndMinutes = date.getHours() + ':' + date.getMinutes();
    //.log(hoursAndMinutes);
    return hoursAndMinutes;
  }
  getReserva(id:number){
    let reserva: Reserva={};
    const url = this.reservas_url + "/" + id;
    this.http.get<Reserva>(url).subscribe(data =>{ 
      reserva = data;
      console.log(reserva);
    });
    return reserva;
  }

}
