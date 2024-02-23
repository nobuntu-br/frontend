import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderDetailsFormComponent } from './order-details-form/order-details-form.component';
import { ListOrderDetailsComponent } from './list-order-details/list-order-details.component';


@NgModule({
  declarations: [
    OrderDetailsFormComponent,
    ListOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    OrderDetailsRoutingModule
  ]
})
export class OrderDetailsModule { }
