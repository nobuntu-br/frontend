import { Component, OnInit } from '@angular/core';
import { TenantService } from 'app/core/tenant/tenant.service';

interface ITenant {
  name: string;
  id: string;
}

@Component({
  selector: 'app-three-dot-menu',
  templateUrl: './three-dot-menu.component.html',
  styleUrls: ['./three-dot-menu.component.scss']
})
export class ThreeDotMenuComponent implements OnInit {
    /**
   * Define o tenent que está sendo utilizado na aplicação.
   */
    tenantEnable: ITenant = { name: '', id: '' };
    /**
     * Todas as tenants que estão disponíveis para serem utilizadas pelo usuario.
     */
    tenants: ITenant[] = [];

  constructor(private tenantService: TenantService) { }

  ngOnInit(): void {
    if (!this.tenantService.getTenant()) {
        return
    }
    this.getTenant();
    this.constructTenantList();
  }

  constructTenantList() {
    this.tenantService.getTenantsEnabled().subscribe(tenants => {
      this.tenants = tenants.map(tenant => {
        return {
          name: tenant.substring(tenant.lastIndexOf('/') + 1, tenant.lastIndexOf('?')),
          id: tenant
        }
      });
    });
  }

  getTenant() {
    this.tenantService.getTenant().subscribe(tenant => {
      this.tenantEnable.id = tenant.dbURI;
      this.tenantEnable.name = this.tenantEnable.id.substring(this.tenantEnable.id.lastIndexOf('/') + 1, this.tenantEnable.id.lastIndexOf('?'));
      console.log("Tenant: ", this.tenantEnable);
    });
  }

  changeTenant(tenant: string) {
    this.tenantService.setTenant(tenant);
    window.location.reload();
  }


}
