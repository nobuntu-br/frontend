import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantCredentialsFormComponent } from './tenant-credentials-form/tenant-credentials-form.component';


const routes: Routes = [
  { path: 'credentials', component: TenantCredentialsFormComponent}, 
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class TenantCredentialsRoutingModule {}
