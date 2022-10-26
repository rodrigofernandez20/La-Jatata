import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComandasComponent } from './comandas/comandas.component';
import { HomeComponent } from './home/home.component';
import { ReservasComponent } from './reservas/reservas.component';
import { AllreservasComponent } from './allreservas/allreservas.component';
import { ProductosComponent } from './productos/productos.component';
import { WaitersComponent } from './waiters/waiters.component';
import { CocinaComponent } from './cocina/cocina.component';
import { MenusComponent } from './menus/menus.component';

const routes: Routes = [
  {path: '',
  redirectTo: 'home',
  pathMatch: 'full'},
  { path: 'comandas', component: ComandasComponent },
  {path:'newreserva',component:ReservasComponent},
  {path:'home',component:HomeComponent},
  {path:'reservas',component:AllreservasComponent},
  {path:'productos',component:ProductosComponent},
  {path:'waiters',component:WaitersComponent},
  {path:'cocina',component:CocinaComponent},
  {path:'menu',component:MenusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents =[ComandasComponent]