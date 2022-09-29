import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComandasComponent } from './comandas/comandas.component';
import { HomeComponent } from './home/home.component';
import { ReservasComponent } from './reservas/reservas.component';

const routes: Routes = [
  {path: '',
  redirectTo: 'home',
  pathMatch: 'full'},
  { path: 'comandas', component: ComandasComponent },
  {path:'reservas',component:ReservasComponent},
  {path:'home',component:HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents =[ComandasComponent]