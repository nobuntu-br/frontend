import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { ITenant, Tenant } from './tenant.model';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError, lastValueFrom, take } from 'rxjs';

/**
 * Serviço que será responsável pelo controle do Tenant
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService extends BaseResourceService<any> {
  url = environment.backendUrl+"/api/tenant";

  private _currentTenant: Tenant | null = null;

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/tenant"; 
    super(url, injector, Tenant.fromJson) 
  }

  /**
   * Obtem o tenant que está sendo usado no momento
   */
  get currentTenant(): Tenant | null {

    if (this._currentTenant != null) {
      return this._currentTenant;
    }

    return this.getAnyTenantInLocalStorage();
  }

  /**
   * Define o tenant que será usado nas requisições
   */
  set currentTenant(tenant : Tenant | null){
    this._currentTenant = tenant;
  }

  getByUserUID(userUID: string): Observable<Tenant[]> {
    return this.http.get(this.url + "/uid/" + userUID).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  async getAllTenantsAndSaveInLocalStorage(userUID: string): Promise<Tenant[]>{
    console.log("obter os tenants e salvar no localstoragE: ", userUID)
    const tenants = await lastValueFrom(this.getByUserUID(userUID));
    this.setTenantsInLocalStore(tenants);
    return tenants;
  }

  getAllTenantsInLocalStorage(userUID: string) {
    //Obtem os tenants armazenados no localstorage
    const storedTenants = JSON.parse(localStorage.getItem('tenants') || '[]');

    //Procura se já existe um tenant igual
    const tenantIndex = storedTenants.findIndex(_userUID => _userUID === userUID);
    if (tenantIndex === -1) {
      return null;
    } else {
      return storedTenants[tenantIndex];
    }
  }

  getAnyTenantInLocalStorage(): Tenant | null{
    //Obtem os tenants armazenados no localstorage
    const storedTenants = JSON.parse(localStorage.getItem('tenants'));

    if(storedTenants == null || storedTenants == '[]' || storedTenants.length == 0){
      return null;
    }

    return Tenant.fromJson(storedTenants[0]);
  }

  getTenantsUserIsAdmin(userUID: string): Observable<Tenant[]>{
    return this.http.get(this.url + "/isAdmin/uid/" + userUID).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  setTenantsInLocalStore(tenants: Tenant[]) {
    console.log("set teantns in local storage: ",tenants);
    localStorage.setItem('tenants', JSON.stringify(tenants));
  }

  removeAllTenantsInLocalStorage() {
    localStorage.removeItem('tenants');
  }

  changeCurrentTenant(tenant: Tenant | null){
    this.currentTenant = tenant;
  }

}
