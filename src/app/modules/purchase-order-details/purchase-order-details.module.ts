import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderDetailsRoutingModule } from './purchase-order-details-routing.module';
import { PurchaseOrderDetailsFormComponent } from './purchase-order-details-form/purchase-order-details-form.component';
import { ListPurchaseOrderDetailsComponent } from './list-purchase-order-details/list-purchase-order-details.component';


@NgModule({
  declarations: [
    PurchaseOrderDetailsFormComponent,
    ListPurchaseOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderDetailsRoutingModule
  ]
})
export class PurchaseOrderDetailsModule { }
