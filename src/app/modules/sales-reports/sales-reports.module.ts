import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesReportsRoutingModule } from './sales-reports-routing.module';
import { SalesReportsFormComponent } from './sales-reports-form/sales-reports-form.component';
import { ListSalesReportsComponent } from './list-sales-reports/list-sales-reports.component';


@NgModule({
  declarations: [
    SalesReportsFormComponent,
    ListSalesReportsComponent
  ],
  imports: [
    CommonModule,
    SalesReportsRoutingModule
  ]
})
export class SalesReportsModule { }
