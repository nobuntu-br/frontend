import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrdersRoutingModule } from './purchase-orders-routing.module';
import { PurchaseOrdersFormComponent } from './purchase-orders-form/purchase-orders-form.component';
import { ListPurchaseOrdersComponent } from './list-purchase-orders/list-purchase-orders.component';


@NgModule({
  declarations: [
    PurchaseOrdersFormComponent,
    ListPurchaseOrdersComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrdersRoutingModule
  ]
})
export class PurchaseOrdersModule { }
