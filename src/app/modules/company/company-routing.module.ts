import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyFormComponent } from './company-form/company-form.component'; 
import { ListCompanyComponent } from './list-company/list-company.component'; 


const routes: Routes = [
  { path: '', component: ListCompanyComponent}, 
  { path: 'new', component: CompanyFormComponent}, 
  { path: ':id/edit', component: CompanyFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class CompanyRoutingModule { }
