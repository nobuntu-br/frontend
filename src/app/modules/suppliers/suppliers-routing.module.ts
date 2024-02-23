import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersFormComponent } from './suppliers-form/suppliers-form.component'; 
import { ListSuppliersComponent } from './list-suppliers/list-suppliers.component'; 


const routes: Routes = [
  { path: '', component: ListSuppliersComponent}, 
  { path: 'new', component: SuppliersFormComponent}, 
  { path: ':id/edit', component: SuppliersFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class SuppliersRoutingModule { }
