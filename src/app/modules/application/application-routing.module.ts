import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationFormComponent } from './application-form/application-form.component'; 
import { ListApplicationComponent } from './list-application/list-application.component'; 


const routes: Routes = [
  { path: '', component: ListApplicationComponent}, 
  { path: 'new', component: ApplicationFormComponent}, 
  { path: ':id/edit', component: ApplicationFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ApplicationRoutingModule { }
