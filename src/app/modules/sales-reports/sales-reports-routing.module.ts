import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReportsFormComponent } from './sales-reports-form/sales-reports-form.component'; 
import { ListSalesReportsComponent } from './list-sales-reports/list-sales-reports.component'; 


const routes: Routes = [
  { path: '', component: ListSalesReportsComponent}, 
  { path: 'new', component: SalesReportsFormComponent}, 
  { path: ':id/edit', component: SalesReportsFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class SalesReportsRoutingModule { }
