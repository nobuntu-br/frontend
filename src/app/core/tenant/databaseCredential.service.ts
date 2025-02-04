import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { DatabaseCredential } from './databaseCredential.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseCredentialService extends BaseResourceService<DatabaseCredential> {
  url = environment.backendUrl + "/api/tenantCredential";

  constructor(protected override injector: Injector) {
    var url = environment.backendUrl + "/api/tenantCredential";

    super(url, injector, DatabaseCredential.fromJson)
  }

}
