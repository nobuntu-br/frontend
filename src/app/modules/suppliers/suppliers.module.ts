import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SuppliersFormComponent } from './suppliers-form/suppliers-form.component';
import { ListSuppliersComponent } from './list-suppliers/list-suppliers.component';


@NgModule({
  declarations: [
    SuppliersFormComponent,
    ListSuppliersComponent
  ],
  imports: [
    CommonModule,
    SuppliersRoutingModule
  ]
})
export class SuppliersModule { }
