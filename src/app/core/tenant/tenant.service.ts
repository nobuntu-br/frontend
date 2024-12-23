import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { ITenant, Tenant } from './tenant.model';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError, lastValueFrom, take } from 'rxjs';
import { LocalStorageService } from 'app/shared/services/local-storage.service';

/**
 * Serviço que será responsável pelo controle do Tenant
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService extends BaseResourceService<any> {

  tenantsLocalStorageKey: string = "tenantsList";
  currentTenantLocalStorageKey: string = "currentTenant";

  url = environment.backendUrl+"/api/tenant";

  private _currentTenant: Tenant | null = null;
  
  constructor(
    protected override injector: Injector,
    private localStorageService: LocalStorageService
  ) { 
    var url = environment.backendUrl+"/api/tenant"; 
    super(url, injector, Tenant.fromJson) 
  }

  /**
   * Obtem o tenant que está sendo usado no momento
   */
  get currentTenant(): Tenant | null {

    //Se não tenant atual ele irá obter dados os localStorage
    if (this._currentTenant == null) {
      this._currentTenant = this.getAnyTenantFromLocalStorage();
      this.setCurrentTenantOnLocalStorage(this._currentTenant);
    }
    
    return this._currentTenant;
  }

  /**
   * Define o tenant que será usado nas requisições
   */
  set currentTenant(tenant : Tenant | null){
    this._currentTenant = tenant;
  }

  /**
   * Realiza a troca de Tenant ativo no momento
   * @param tenantCredentialId ID das credenciais do Tenant que será ativo
   */
  switchTenant(tenantCredentialId: string): ITenant {

    const tenants: ITenant[] = this.getTenantsFromLocalstorage();
    //Percorre o Tenants salvos no local Storage.
    const tenant: ITenant = tenants.find(tenant => tenant.tenantCredentialId === tenantCredentialId) || null;

    if (tenant != null) {
      //Caso for encontrado o Tenant que se tem interesse em fazer uso, faz a troca para esse Tenat que será a utilizado nas requisições
      this.currentTenant = tenant;
      //Armazena no local storage o Tenant ativo
      this.setCurrentTenantOnLocalStorage(this.currentTenant);

      return this.currentTenant;
    }

    throw new Error("Não foi possível alterar o Tenant ativo");

  }

  getByUserUID(userUID: string): Observable<Tenant[]> {
    return this.http.get(this.url + "/uid/" + userUID).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  setCurrentTenantOnLocalStorage(currentTenant: ITenant): ITenant{
    this.localStorageService.set(this.currentTenantLocalStorageKey, currentTenant);
    return currentTenant;
  }

  getCurrentTenantFromLocalStorage(): ITenant {
    const currentTenant = this.localStorageService.get(this.currentTenantLocalStorageKey);
    return currentTenant;
  }

  getTenantsFromLocalstorage(): ITenant[] | null {
    const localStorageData = this.localStorageService.get(this.tenantsLocalStorageKey);
    
    if( localStorageData == "" || 
      localStorageData == "[]"
    ){
      return null;
    }

    return localStorageData;
  }

  async getTenantsAndSaveInLocalStorage(userUID: string): Promise<ITenant[]>{
    const tenants = await lastValueFrom(this.getByUserUID(userUID));
    this.localStorageService.set(this.tenantsLocalStorageKey, tenants);
    return tenants;
  }

  addTenantOnLocalStorage(tenant: ITenant): void {
    
    var tenants : ITenant[] | null = this.getTenantsFromLocalstorage();

    if(tenants != null){

      tenants = tenants.filter(_tenant => _tenant.tenantCredentialId !== tenant.tenantCredentialId);
      //Adiciona novamente (caso tenha algum dado alterado)
      tenants.push(tenant);
      //Salva novamente dentro do array de tenants
      this.localStorageService.set(this.tenantsLocalStorageKey, tenants)
    } else {
      //Salva o array contendo os tenants
      this.localStorageService.set(this.tenantsLocalStorageKey, [tenants]);
    }

  }

  // getAllTenantsInLocalStorage(userUID: string): ITenant[] | null {
  //   //Obtem os tenants armazenados no localstorage
  //   const storedTenants = JSON.parse(localStorage.getItem('tenants') || '[]');

  //   //Procura se já existe um tenant igual
  //   const tenantIndex = storedTenants.findIndex(_userUID => _userUID === userUID);
  //   if (tenantIndex === -1) {
  //     return null;
  //   } else {
  //     return storedTenants[tenantIndex];
  //   }
  // }

  getAnyTenantFromLocalStorage(): ITenant | null{
    const storedTenants: ITenant[] = this.getTenantsFromLocalstorage();
    
    if(storedTenants == null || storedTenants.length == 0){
      return null;
    }

    return storedTenants[0];
  }

  getTenantsUserIsAdmin(userUID: string): Observable<Tenant[]>{
    return this.http.get(this.url + "/isAdmin/uid/" + userUID).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  deleteTenantFromLocalStorage(tenantCredentialId: string): string | null {

    var tenants : ITenant[] = this.getTenantsFromLocalstorage();

    if(tenants != null){

      tenants = tenants.filter(_tenant => _tenant.tenantCredentialId !== tenantCredentialId);

      this.localStorageService.set(this.tenantsLocalStorageKey, tenants);

      return tenantCredentialId;
    }

    return null;
  }

  deleteAllTenantsFromLocalStorage(){
    this.localStorageService.remove(this.tenantsLocalStorageKey);
  }

  deleteCurrentTenantFromLocalStorage(){
    this.localStorageService.remove(this.currentTenantLocalStorageKey);
  }

  changeCurrentTenant(tenant: Tenant | null){
    this.currentTenant = tenant;
  }

}