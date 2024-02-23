import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersFormComponent } from './orders-form/orders-form.component'; 
import { ListOrdersComponent } from './list-orders/list-orders.component'; 


const routes: Routes = [
  { path: '', component: ListOrdersComponent}, 
  { path: 'new', component: OrdersFormComponent}, 
  { path: ':id/edit', component: OrdersFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class OrdersRoutingModule { }
