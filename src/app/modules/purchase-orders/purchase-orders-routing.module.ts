import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrdersFormComponent } from './purchase-orders-form/purchase-orders-form.component'; 
import { ListPurchaseOrdersComponent } from './list-purchase-orders/list-purchase-orders.component'; 


const routes: Routes = [
  { path: '', component: ListPurchaseOrdersComponent}, 
  { path: 'new', component: PurchaseOrdersFormComponent}, 
  { path: ':id/edit', component: PurchaseOrdersFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class PurchaseOrdersRoutingModule { }
