import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippersFormComponent } from './shippers-form/shippers-form.component'; 
import { ListShippersComponent } from './list-shippers/list-shippers.component'; 


const routes: Routes = [
  { path: '', component: ListShippersComponent}, 
  { path: 'new', component: ShippersFormComponent}, 
  { path: ':id/edit', component: ShippersFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ShippersRoutingModule { }
