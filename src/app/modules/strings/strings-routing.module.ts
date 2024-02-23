import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StringsFormComponent } from './strings-form/strings-form.component'; 
import { ListStringsComponent } from './list-strings/list-strings.component'; 


const routes: Routes = [
  { path: '', component: ListStringsComponent}, 
  { path: 'new', component: StringsFormComponent}, 
  { path: ':id/edit', component: StringsFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class StringsRoutingModule { }
