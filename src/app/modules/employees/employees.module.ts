import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesFormComponent } from './employees-form/employees-form.component';
import { ListEmployeesComponent } from './list-employees/list-employees.component';


@NgModule({
  declarations: [
    EmployeesFormComponent,
    ListEmployeesComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule
  ]
})
export class EmployeesModule { }
