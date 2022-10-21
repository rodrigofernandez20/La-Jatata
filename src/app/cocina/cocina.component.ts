import { Time } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ComandaService } from '../comanda.service';
import { Comanda } from '../models/comanda.model';
import { Reserva } from '../models/reserva.model';
import { environment } from "../../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Token } from '@angular/compiler';
import { TokenModel } from '../models/token.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  tokens : string[]=[];

  constructor(public http: HttpClient, private comandaService:ComandaService,private snackBar: MatSnackBar) { 
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
  getAllTokens(currentToken:string){
    console.log(currentToken)
    /*this.http.get<TokenModel[]>("http://localhost:3000/tokens").subscribe(data =>{ 
      const allItems = Object.values(data);
      for(let i =0; i<allItems.length;i++){
        this.tokens.push(allItems[i].token!)
      }
      if(this.tokens.indexOf(currentToken) ===-1){
        this.postCurrentToken(currentToken)
       }
      console.log(this.tokens);
    });*/
  }
  postCurrentToken(currentToken:string){
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
    const httpOptionsForFirebase = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          'Authorization': 'key=AAAAQ3zNzwQ:APA91bHcMyyjgDskJcFPoSWs3-JBaMnbDFTLKGvmqODYChceIsJKDflQH_1M362LHE6euTwJyt5var8lWcwR0uvlx6K40GQZI5E1Zh9Ttcoz29ll02byuEltM4sedPOEF0OHq1HJeyfZ',
          'project_id': '289856671492'
      })
    };
    const sentToken = {
      'token':currentToken
    }
    const firebaseGroup ={
      "operation": "add",
      "notification_key_name": "comanda",
      "notification_key": "APA91bGy4YghJ6n0SMNfiidhBaYzGnDLfj66kyBN_5_xPV4BY9Ad_Ndys2NvZ-Km8meJBnz7uLBxruW9cDNC2nKlQALjNcUHGpSK7L73XiqzISSZ_n266Is",
      "registration_ids": [currentToken]
    }
    console.log(JSON.stringify(sentToken))
    this.tokens.push(currentToken);
    //CORS TROUBLE, LEARN HOW TO FIX
    //this.http.post("https://fcm.googleapis.com/fcm/notification", JSON.stringify(firebaseGroup), httpOptionsForFirebase)
          //.subscribe(data => console.log(data));
    //this.http.post("http://localhost:3000/tokens", JSON.stringify(sentToken), httpOptions)
          //.subscribe(data => console.log(data));
    
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
           console.log(currentToken);
           this.getAllTokens(currentToken);
           /*if(this.tokens.indexOf(currentToken) ===-1){
            this.postCurrentToken(currentToken)
           }*/
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
      this.playAudio()
      const snack = this.snackBar.open('Se ha agregado una nueva comanda',"Cerrar");
    });
  }
  playAudio(){
    let audio = new Audio();
    audio.src = "../../assets/audio/alert.wav";
    audio.load();
    audio.play();
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
