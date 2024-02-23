import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesFormComponent } from './invoices-form/invoices-form.component'; 
import { ListInvoicesComponent } from './list-invoices/list-invoices.component'; 


const routes: Routes = [
  { path: '', component: ListInvoicesComponent}, 
  { path: 'new', component: InvoicesFormComponent}, 
  { path: ':id/edit', component: InvoicesFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class InvoicesRoutingModule { }
