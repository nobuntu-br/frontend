import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsFormComponent } from './order-details-form/order-details-form.component'; 
import { ListOrderDetailsComponent } from './list-order-details/list-order-details.component'; 


const routes: Routes = [
  { path: '', component: ListOrderDetailsComponent}, 
  { path: 'new', component: OrderDetailsFormComponent}, 
  { path: ':id/edit', component: OrderDetailsFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class OrderDetailsRoutingModule { }
