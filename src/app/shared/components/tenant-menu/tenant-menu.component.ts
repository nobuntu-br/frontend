import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TenantCredentialFormComponent } from 'app/core/tenant/tenant-credential-form/tenant-credential-form.component';
import { Tenant } from 'app/core/tenant/tenant.model';
import { TenantService } from 'app/core/tenant/tenant.service';
import { lastValueFrom } from 'rxjs';

interface ITenant {
  name: string;
  id: string;
}

@Component({
  selector: 'tenant-menu',
  templateUrl: './tenant-menu.component.html',
  styleUrls: ['./tenant-menu.component.scss']
})
export class TenantMenuComponent implements OnInit{
  /**
     * Define o tenent que está sendo utilizado na aplicação.
     */
  tenantEnable: ITenant = { name: '', id: '' };
  /**
   * Todas as tenants que estão disponíveis para serem utilizadas pelo usuario.
   */
  tenants: ITenant[];

  constructor(private tenantService: TenantService, private dialog: MatDialog) { }

  ngOnInit(): void {
    // if (!this.tenantService.getTenant()) {
    //     return
    // }
    // this.getTenant();
    this.constructTenantList();
  }

  async constructTenantList() {
    // this.tenantService.getAll().pipe(take(1)).subscribe(tenants => {
    //   this.tenants = tenants.map(tenant => {
    //     return {
    //       name: tenant.substring(tenant.lastIndexOf('/') + 1, tenant.lastIndexOf('?')),
    //       id: tenant
    //     }
    //   });
    // });
    this.tenants = await lastValueFrom(this.tenantService.getAll());
  }

  createTenant() {
    this.dialog.open(TenantCredentialFormComponent, {
      width: '380px'
    });
  }

  changeTenant(tenant: Tenant | null) {
    this.tenantService.currentTenant = tenant;
    window.location.reload();
  }
}
