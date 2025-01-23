import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { ITenant, Tenant } from './tenant.model';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError, lastValueFrom, take, firstValueFrom } from 'rxjs';
import { LocalStorageService } from 'app/shared/services/local-storage.service';
import { DatabasePermission } from './databasePermission.model';

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

  private _currentTenant: DatabasePermission | null = null;
  
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
  get currentTenant(): DatabasePermission | null {

    //Se não tenant atual ele irá obter dados os localStorage
    if (this._currentTenant == null) {
      this.currentTenant = this.getAnyTenantFromLocalStorage();
      this.setCurrentTenantOnLocalStorage(this._currentTenant);
    }
    
    return this._currentTenant;
  }

  /**
   * Define o tenant que será usado nas requisições
   */
  set currentTenant(tenant : DatabasePermission | null){
    this._currentTenant = tenant;
  }

  /**
   * Realiza a troca de Tenant ativo no momento
   * @param tenantId ID das credenciais do Tenant que será ativo
   */
  switchTenant(tenantId: string): DatabasePermission {

    const tenants: DatabasePermission[] = this.getTenantsFromLocalstorage();
    //Percorre o Tenants salvos no local Storage.
    const tenant: DatabasePermission = tenants.find(_databasePermission => _databasePermission.tenant.id === tenantId) || null;

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

  getCurrentTenantFromLocalStorage(): ITenant | null {
    const currentTenant = this.localStorageService.get(this.currentTenantLocalStorageKey);

    if( currentTenant == "" || 
      currentTenant == "[]"
    ){
      return null;
    }

    return currentTenant;
  }

  getTenantsFromLocalstorage(): DatabasePermission[] | null {
    const localStorageData = this.localStorageService.get(this.tenantsLocalStorageKey);
    
    if( localStorageData == "" || 
      localStorageData == "[]"
    ){
      return null;
    }

    return localStorageData;
  }

  async getTenantsAndSaveInLocalStorage(userUID: string): Promise<DatabasePermission[] | null>{

    try {
      let tenants: DatabasePermission[] = await firstValueFrom(this.http.get<DatabasePermission[]>(this.url + "/uid/" + userUID).pipe(take(1)));
      this.localStorageService.set(this.tenantsLocalStorageKey, tenants);

      return tenants;
    } catch (error) {
      console.log("Error to get tenants: ", error);
      return null;
    }

    // this.http.get<DatabasePermission[]>(this.url + "/uid/" + userUID).pipe(take(1)).subscribe({
    //   next: (tenants: DatabasePermission[]) => {
    //     this.localStorageService.set(this.tenantsLocalStorageKey, tenants);
    //     return tenants;
    //   },
    //   error: (error) => {
    //     console.log("Error to get tenants: ", error);
    //     return null;
    //   }
    // });

  }

  addTenantOnLocalStorage(databasePermission: DatabasePermission): void {
    
    let databasePermissions : DatabasePermission[] | null = this.getTenantsFromLocalstorage();

    if(databasePermissions != null){

      databasePermissions = databasePermissions.filter(_databasePermissions => _databasePermissions.databaseCredential.id !== databasePermission.databaseCredential.id);
      //Adiciona novamente (caso tenha algum dado alterado)
      databasePermissions.push(databasePermission);
      //Salva novamente dentro do array de tenants
      this.localStorageService.set(this.tenantsLocalStorageKey, databasePermissions)
    } else {
      //Salva o array contendo os tenants
      this.localStorageService.set(this.tenantsLocalStorageKey, [databasePermissions]);
    }

  }

  getAnyTenantFromLocalStorage(): DatabasePermission | null{
    const storedDatabasePermissions: DatabasePermission[] = this.getTenantsFromLocalstorage();
    
    if(storedDatabasePermissions == null || storedDatabasePermissions.length == 0){
      return null;
    }

    return storedDatabasePermissions[0];
  }

  getTenantsUserIsAdmin(userUID: string): Observable<Tenant[]>{
    return this.http.get(this.url + "/isAdmin/uid/" + userUID).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  deleteTenantFromLocalStorage(databaseCredentialId: number): number | null {

    let databasePermissions : DatabasePermission[] = this.getTenantsFromLocalstorage();

    if(databasePermissions != null || databasePermissions.length > 0){

      databasePermissions = databasePermissions.filter(_databasePermission => _databasePermission.databaseCredential.id !== databaseCredentialId);

      this.localStorageService.set(this.tenantsLocalStorageKey, databasePermissions);

      return databaseCredentialId;
    }

    return null;
  }

  deleteAllTenantsFromLocalStorage(){
    this.localStorageService.remove(this.tenantsLocalStorageKey);
  }

  deleteCurrentTenantFromLocalStorage(){
    this.localStorageService.remove(this.currentTenantLocalStorageKey);
  }

  changeCurrentTenant(tenant: DatabasePermission | null){
    this.currentTenant = tenant;
  }

}