import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantUserListComponent } from './tenant-user-list/tenant-user-list.component';
import { DatabaseCredentialFormComponent } from './database-credential-form/database-credential-form.component';

const routes: Routes = [
  { path: '', component: TenantListComponent}, 
  { path: 'users', component: TenantUserListComponent},
  { path: 'add', component: DatabaseCredentialFormComponent},
  { path: 'edit', component: DatabaseCredentialFormComponent} 
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class TenantRoutingModule { }
