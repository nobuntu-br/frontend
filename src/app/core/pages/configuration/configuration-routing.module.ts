import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationMenuComponent } from './configuration-menu/configuration-menu.component';

const routes: Routes = [
  { path: '', component: ConfigurationMenuComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
