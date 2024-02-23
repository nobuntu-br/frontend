import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersTaxStatusFormComponent } from './orders-tax-status-form/orders-tax-status-form.component'; 
import { ListOrdersTaxStatusComponent } from './list-orders-tax-status/list-orders-tax-status.component'; 


const routes: Routes = [
  { path: '', component: ListOrdersTaxStatusComponent}, 
  { path: 'new', component: OrdersTaxStatusFormComponent}, 
  { path: ':id/edit', component: OrdersTaxStatusFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class OrdersTaxStatusRoutingModule { }
