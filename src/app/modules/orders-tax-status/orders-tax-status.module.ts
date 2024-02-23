import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersTaxStatusRoutingModule } from './orders-tax-status-routing.module';
import { OrdersTaxStatusFormComponent } from './orders-tax-status-form/orders-tax-status-form.component';
import { ListOrdersTaxStatusComponent } from './list-orders-tax-status/list-orders-tax-status.component';


@NgModule({
  declarations: [
    OrdersTaxStatusFormComponent,
    ListOrdersTaxStatusComponent
  ],
  imports: [
    CommonModule,
    OrdersTaxStatusRoutingModule
  ]
})
export class OrdersTaxStatusModule { }
