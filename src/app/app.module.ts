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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ComandasComponent } from './comandas/comandas.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {MatDividerModule} from '@angular/material/divider';
//import { FormReservaComponent } from './form-reserva/form-reserva.component';
import { ReservaModalComponent } from './reserva-modal/reserva-modal.component';
import { AllreservasComponent } from './allreservas/allreservas.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';

import { CommonModule } from '@angular/common';

import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { ProductosComponent } from './productos/productos.component';
import { NewproductModalComponent } from './newproduct-modal/newproduct-modal.component';
import { WaitersComponent } from './waiters/waiters.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ReciboModalComponent } from './recibo-modal/recibo-modal.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { CocinaComponent } from './cocina/cocina.component';
import { ComandaService } from './comanda.service';
//import { NgMaterialModule } from './ng-material/ng-material.module';
import { environment } from "../environments/environment";
import { initializeApp } from "firebase/app";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MenusComponent } from './menus/menus.component';
import {MatGridListModule} from '@angular/material/grid-list';


initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    ReservasComponent,
    QuantityModalComponent,
    ConfirmModalComponent,
    routingComponents,
    HomeComponent,
    ReservaModalComponent,
    AllreservasComponent,
    ProductosComponent,
    NewproductModalComponent,
    WaitersComponent,
    ReciboModalComponent,
    PaymentModalComponent,
    CocinaComponent,
    MenusComponent
  ],
  imports: [
    BrowserModule,
    MatListModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatSidenavModule,
    RouterModule,
    MatToolbarModule,
    AppRoutingModule,
    MatMenuModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,CommonModule,MatSortModule,MatTableModule,MatRadioModule,MatIconModule,MatSelectModule,MatNativeDateModule, MatInputModule,MatDatepickerModule, MatButtonModule,CdkAccordionModule,MatExpansionModule, MatCardModule, MatFormFieldModule,FormsModule,MatSnackBarModule,MatDividerModule
  ],
  providers: [ComandaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
