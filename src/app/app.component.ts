import { ChangeDetectorRef, Component } from '@angular/core';
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
import { MediaMatcher } from '@angular/cdk/layout';
import { NavItem } from './nav-item';
import { ReservaModalComponent } from './reserva-modal/reserva-modal.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  header:string = 'La Jatata'
  menu: NavItem [] = [
    {
      displayName: 'Inicio',
      iconName: 'home',
      route: '/home'
    },        
    {
      displayName: 'Reservas',
      iconName: 'restaurant',
      route: '/reservas',
    },
    {
      displayName: 'Cocina',
      iconName: 'kitchen',
      route: '/cocina',
    },
    {
      displayName: 'Menu',
      iconName: 'menu_book',
      route: '/menu',
    },
    {
      displayName: 'Productos',
      iconName: 'brunch_dining',
      route: '/productos',
    },
    {
      displayName: 'Ventas',
      iconName: 'assessment',
      route: '/ventas',
    },
    {
      displayName: 'Meseros',
      iconName: 'face',
      route: '/waiters',
    }
    /*{
      displayName: 'Expedientes',
      iconName: 'description',          
      children: [
        {
          displayName: 'Mis Expedientes',
          iconName: 'how_to_reg',
          route: '/misexpedientes'
        },
        { 
          displayName: 'Todos',
          iconName: 'waves',
          route: '/todos'
        }
      ]
    },
    {
      displayName: 'Perfiles',
      iconName: 'group',
      children: [
          {
            displayName: 'Búsqueda Perfil',
            iconName: 'search',
            route: '/busquedaperfiles'
          }
        ]
      }*/
  ];
  mobileQuery: MediaQueryList;
  selectedIndex: number =-1;
  title = 'La-Jatata';
  message:any = null;
  private _mobileQueryListener: () => void;
  
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private  dialog:  MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  showForm(){
    const ref =this.dialog.open(ReservaModalComponent)
  }
  changeTitle(title:string){
    this.header = title;
  }
  select(index: number) {
    this.selectedIndex = index; 
  }  
  ngOnInit(): void {
    //this.requestPermission();
    //this.listen();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
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
