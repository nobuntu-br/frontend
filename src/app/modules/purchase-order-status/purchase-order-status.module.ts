import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderStatusRoutingModule } from './purchase-order-status-routing.module';
import { PurchaseOrderStatusFormComponent } from './purchase-order-status-form/purchase-order-status-form.component';
import { ListPurchaseOrderStatusComponent } from './list-purchase-order-status/list-purchase-order-status.component';


@NgModule({
  declarations: [
    PurchaseOrderStatusFormComponent,
    ListPurchaseOrderStatusComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderStatusRoutingModule
  ]
})
export class PurchaseOrderStatusModule { }
