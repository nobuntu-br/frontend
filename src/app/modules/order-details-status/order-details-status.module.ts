import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailsStatusRoutingModule } from './order-details-status-routing.module';
import { OrderDetailsStatusFormComponent } from './order-details-status-form/order-details-status-form.component';
import { ListOrderDetailsStatusComponent } from './list-order-details-status/list-order-details-status.component';


@NgModule({
  declarations: [
    OrderDetailsStatusFormComponent,
    ListOrderDetailsStatusComponent
  ],
  imports: [
    CommonModule,
    OrderDetailsStatusRoutingModule
  ]
})
export class OrderDetailsStatusModule { }
