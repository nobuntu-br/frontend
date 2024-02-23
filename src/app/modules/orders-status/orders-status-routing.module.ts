import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersStatusFormComponent } from './orders-status-form/orders-status-form.component'; 
import { ListOrdersStatusComponent } from './list-orders-status/list-orders-status.component'; 


const routes: Routes = [
  { path: '', component: ListOrdersStatusComponent}, 
  { path: 'new', component: OrdersStatusFormComponent}, 
  { path: ':id/edit', component: OrdersStatusFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class OrdersStatusRoutingModule { }
