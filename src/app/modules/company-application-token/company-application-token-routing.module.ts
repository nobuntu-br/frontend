import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyApplicationTokenFormComponent } from './company-application-token-form/company-application-token-form.component'; 
import { ListCompanyApplicationTokenComponent } from './list-company-application-token/list-company-application-token.component'; 


const routes: Routes = [
  { path: '', component: ListCompanyApplicationTokenComponent}, 
  { path: 'new', component: CompanyApplicationTokenFormComponent}, 
  { path: ':id/edit', component: CompanyApplicationTokenFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class CompanyApplicationTokenRoutingModule { }
