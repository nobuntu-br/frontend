import { Component, OnInit } from '@angular/core';
import { ITenant } from '../tenant.model';
import { TenantService } from '../tenant.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'userPermissionTenant', 'databaseCredential'];

  tenants: ITenant[] = [];

  /**
  * Variável de controle se está em carregamento a página
  */
  isLoading: boolean = false;

  constructor(
    private tenantService: TenantService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.currentUser != null) {
      this.getTenants(this.authService.currentUser.UID);
    }

  }

  async getTenants(userUID: string) {
    this.isLoading = true;
    this.tenants = await firstValueFrom(this.tenantService.getAll());
    this.isLoading = false;
  }

  goToUserTenantPage(tenantId: number) {
    this.router.navigate(['tenant', tenantId, 'users']);
  }

  goToCreateTenantPage() {
    this.router.navigate(['tenant', 'add']);
  }

  goToDatabaseCredentialPage(tenantId: number) {
    this.router.navigate(['tenant', tenantId, 'databaseCredential']);
  }

}