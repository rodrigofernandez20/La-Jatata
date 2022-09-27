import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppRoutingModule,routingComponents} from './app-routing.module';
import { AppComponent } from './app.component';
import { ReservasComponent } from './reservas/reservas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule } from '@angular/material/dialog';
import { QuantityModalComponent } from './quantity-modal/quantity-modal.component';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ComandasComponent } from './comandas/comandas.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
//import { FormReservaComponent } from './form-reserva/form-reserva.component';
import { ReservaModalComponent } from './reserva-modal/reserva-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    ReservasComponent,
    QuantityModalComponent,
    ConfirmModalComponent,
    routingComponents,
    HomeComponent,
    ReservaModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule,FormsModule,MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
