import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersFormComponent } from './customers-form/customers-form.component'; 
import { ListCustomersComponent } from './list-customers/list-customers.component'; 


const routes: Routes = [
  { path: '', component: ListCustomersComponent}, 
  { path: 'new', component: CustomersFormComponent}, 
  { path: ':id/edit', component: CustomersFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class CustomersRoutingModule { }
