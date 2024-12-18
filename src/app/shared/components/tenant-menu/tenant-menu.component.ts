import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ITenant } from 'app/core/tenant/tenant.model';
import { TenantService } from 'app/core/tenant/tenant.service';


@Component({
  selector: 'tenant-menu',
  templateUrl: './tenant-menu.component.html',
  styleUrls: ['./tenant-menu.component.scss']
})
export class TenantMenuComponent implements OnInit {
  /**
   * Tenants
   */
  tenants: ITenant[] = [];
  /**
   * Tenant ativo no momento
   */
  currentTenant: ITenant;

  constructor(
    private tenantService: TenantService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    //Obtem o Tenant atual para manipular o componente
    this.currentTenant = this.tenantService.currentTenant;
    this.getTenants();
  }

  async getTenants() {
    const currentUserSessionUID = this.authService.currentUserSession.user.UID;

    if (currentUserSessionUID != null) {
      //Obtem os tenants que o usuário tem acesso e salva no armazenamento local
      this.tenants = await this.tenantService.getTenantsAndSaveInLocalStorage(currentUserSessionUID);
    }

  }

  goToAddTenantPage() {
    this.router.navigate(['/tenant/add']);
  }

  goToTenantPage() {
    this.router.navigate(['/tenant']);
  }

  changeTenant(tenantCredentialId: string) {
    this.tenantService.switchTenant(tenantCredentialId);
    window.location.reload();
  }

}
