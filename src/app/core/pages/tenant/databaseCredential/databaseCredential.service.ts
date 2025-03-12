import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { DatabaseCredential } from './databaseCredential.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

type RegisterDatabaseCredentialInputDTO = {
  databaseCredential: DatabaseCredential;
  tenantId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseCredentialService extends BaseResourceService<DatabaseCredential> {
  url = environment.backendUrl + "/api/database-credential";//TODO não faz sentido ter isso repetido
  protected http: HttpClient;

  constructor(protected override injector: Injector) {
    let url = environment.backendUrl + "/api/database-credential";

    super(url, injector, DatabaseCredential.fromJson);
  }

  _create(resource: RegisterDatabaseCredentialInputDTO): Observable<DatabaseCredential> {
    let field : any = resource.databaseCredential;
    field.tenantId = resource.tenantId;
    return this.createWithCustomParameter(field);
  }

  getByTenantId(tenantId: number): Observable<DatabaseCredential[]> {
    return this.http.get<DatabaseCredential[]>(`${this.url}/tenant/` + tenantId);
  }

}
