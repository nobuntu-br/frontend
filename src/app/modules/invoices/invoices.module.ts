import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesFormComponent } from './invoices-form/invoices-form.component';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';


@NgModule({
  declarations: [
    InvoicesFormComponent,
    ListInvoicesComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule
  ]
})
export class InvoicesModule { }
