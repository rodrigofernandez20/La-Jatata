import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { queue } from 'rxjs';
import { QuantityModalComponent } from './quantity-modal/quantity-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import $ from "jquery";
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  title = 'La-Jatata';
  message:any = null;
  constructor() {}
  ngOnInit(): void {
    this.requestPermission();
    this.listen();
  }
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
    });
  }
}
