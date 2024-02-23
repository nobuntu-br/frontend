import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesFormComponent } from './employees-form/employees-form.component'; 
import { ListEmployeesComponent } from './list-employees/list-employees.component'; 


const routes: Routes = [
  { path: '', component: ListEmployeesComponent}, 
  { path: 'new', component: EmployeesFormComponent}, 
  { path: ':id/edit', component: EmployeesFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class EmployeesRoutingModule { }
