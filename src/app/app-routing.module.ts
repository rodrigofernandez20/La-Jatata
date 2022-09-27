import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComandasComponent } from './comandas/comandas.component';
import { ReservasComponent } from './reservas/reservas.component';

const routes: Routes = [
  {path: '',
  redirectTo: 'reservas',
  pathMatch: 'full'},
  { path: 'comandas', component: ComandasComponent },
  {path:'reservas',component:ReservasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents =[ComandasComponent]