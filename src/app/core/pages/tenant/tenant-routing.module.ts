import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantUserListComponent } from './tenant-user-list/tenant-user-list.component';
import { DatabaseCredentialFormComponent } from './databaseCredential/database-credential-form/database-credential-form.component';
import { TenantFormComponent } from './tenant-form/tenant-form.component';
import { DatabaseCredentialListComponent } from './databaseCredential/database-credential-list/database-credential-list.component';

const routes: Routes = [
  { path: '', component: TenantListComponent },
  { path: 'add', component: TenantFormComponent },
  { path: ':id/users', component: TenantUserListComponent },
  { path: ':id/databaseCredential', component: DatabaseCredentialListComponent },
  { path: ':id/databaseCredential/add', component: DatabaseCredentialFormComponent },
  { path: ':id/databaseCredential/edit', component: DatabaseCredentialFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantRoutingModule { }
