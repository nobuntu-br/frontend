import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderStatusFormComponent } from './purchase-order-status-form/purchase-order-status-form.component'; 
import { ListPurchaseOrderStatusComponent } from './list-purchase-order-status/list-purchase-order-status.component'; 


const routes: Routes = [
  { path: '', component: ListPurchaseOrderStatusComponent}, 
  { path: 'new', component: PurchaseOrderStatusFormComponent}, 
  { path: ':id/edit', component: PurchaseOrderStatusFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class PurchaseOrderStatusRoutingModule { }
