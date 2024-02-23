import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsStatusFormComponent } from './order-details-status-form/order-details-status-form.component'; 
import { ListOrderDetailsStatusComponent } from './list-order-details-status/list-order-details-status.component'; 


const routes: Routes = [
  { path: '', component: ListOrderDetailsStatusComponent}, 
  { path: 'new', component: OrderDetailsStatusFormComponent}, 
  { path: ':id/edit', component: OrderDetailsStatusFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class OrderDetailsStatusRoutingModule { }
