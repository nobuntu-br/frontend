import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersStatusRoutingModule } from './orders-status-routing.module';
import { OrdersStatusFormComponent } from './orders-status-form/orders-status-form.component';
import { ListOrdersStatusComponent } from './list-orders-status/list-orders-status.component';


@NgModule({
  declarations: [
    OrdersStatusFormComponent,
    ListOrdersStatusComponent
  ],
  imports: [
    CommonModule,
    OrdersStatusRoutingModule
  ]
})
export class OrdersStatusModule { }
