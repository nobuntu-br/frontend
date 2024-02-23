import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippersRoutingModule } from './shippers-routing.module';
import { ShippersFormComponent } from './shippers-form/shippers-form.component';
import { ListShippersComponent } from './list-shippers/list-shippers.component';


@NgModule({
  declarations: [
    ShippersFormComponent,
    ListShippersComponent
  ],
  imports: [
    CommonModule,
    ShippersRoutingModule
  ]
})
export class ShippersModule { }
