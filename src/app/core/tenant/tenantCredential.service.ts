import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { TenantCredential } from './tenantCredential.model';

@Injectable({
  providedIn: 'root'
})
export class TenantCredentialService extends BaseResourceService<TenantCredential> {
  url = environment.backendUrl + "/api/tenantCredential";
  
  constructor(protected override injector: Injector) {
    var url = environment.backendUrl + "/api/tenantCredential";

    super(url, injector, TenantCredential.fromJson)
  }
}
