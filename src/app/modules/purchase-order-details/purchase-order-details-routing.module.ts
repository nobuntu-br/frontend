import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderDetailsFormComponent } from './purchase-order-details-form/purchase-order-details-form.component'; 
import { ListPurchaseOrderDetailsComponent } from './list-purchase-order-details/list-purchase-order-details.component'; 


const routes: Routes = [
  { path: '', component: ListPurchaseOrderDetailsComponent}, 
  { path: 'new', component: PurchaseOrderDetailsFormComponent}, 
  { path: ':id/edit', component: PurchaseOrderDetailsFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class PurchaseOrderDetailsRoutingModule { }
