import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersFormComponent } from './orders-form/orders-form.component';
import { ListOrdersComponent } from './list-orders/list-orders.component';


@NgModule({
  declarations: [
    OrdersFormComponent,
    ListOrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
