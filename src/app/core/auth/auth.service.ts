import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of, take } from 'rxjs';
import { environment } from 'environments/environment';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { IUser, IUserAccessInfo, User } from './user.model';
import { AuthUtils } from './auth.utils';
import { TenantService } from '../tenant/tenant.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  _authenticated: boolean = false;
  claims: any;
  authorizationResponse;

  // private userManager: UserManager;
  private _currentUser: IUser | null = null;

  /**
   * Constructor
   */
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private userService: UserService,
    private tenantService: TenantService
  ) {
    // Recuperar o estado do usuário do localStorage ao iniciar
    this.restoreUser();
  }

  get authenticated() {
    console.log("O usuário está com acesso: ",this._authenticated);
    return this._authenticated;
  }

  get accessToken(): string | null {
    return this.currentUser?.accessInfo.access_token ?? null;
  }

  get currentUser(): IUser | null {

    if(this._currentUser == null){
      this._currentUser = this.userService.getAnyUserFromLocalStorage();
    }

    return this._currentUser;
  }

  set currentUser(user: IUser | null) {
    this._currentUser = user;
  }

  isLoggedIn(): boolean {
    return this.currentUser != null && AuthUtils.isTokenExpired(this._currentUser.accessInfo.access_token);
  }

  private async restoreUser(): Promise<void> {
    try {
      // const user = await this.userManager.getUser();
      const userString = localStorage.getItem('currentUser');
      const user = userString ? JSON.parse(userString) : null;
      // Verifica se o user não é null, não é undefined e não é um array vazio
      if (user && (!Array.isArray(user) || user.length > 0)) {
        console.log("To aqui");
        this.currentUser = user;
        this._authenticated = true;
        // this.userManager.storeUser(user);
      }
    } catch (error) {
      console.error('Error restoring user', error);
    }
  }

  private async checkAndRegisterUser(user: IUser): Promise<void> {

    try {
      const data = await firstValueFrom(this.userService.getByUID(user.UID));
      console.log(data);
      
    } catch (error) {
      console.log("Dados para criação do usuário: ", user);
      const registeredUser = await firstValueFrom(this.userService.create(user));
      
    }


    // try {
    //   // this.userService.getByUID(user.UID).pipe(take(1)).subscribe({
    //   //   next(value) {
    //   //     console.log("Usuário encontrado!");
    //   //   },
    //   //   async error(err) {
    //   //     const registeredUser = await firstValueFrom(this.userService.create(user));
    //   //   },
    //   // })
    // } catch (error) {
    //   // const registeredUser = await firstValueFrom(this.userService.create(user));
    // }
  }

  /**
   * Realiza a troca do usuário
   * @param userUID UID do usuário
   */
  switchUser(userUID: string): IUser | null {
    const users: IUser[] = this.userService.getUsersFromLocalstorage();
    this.currentUser = users.find(user => user.UID === userUID) || null;
  
    if (this.currentUser == null) {
      return null;
    }
  
    // Armazena o currentUser no localStorage
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
 
    return this.currentUser;
  }

  async logoutAllAccounts(): Promise<void> {
    try {
      localStorage.clear();
      this.currentUser = null;
      //TODO registrar o final de sessão de todos os usuários
    } catch (error) {
      console.error('Error during logout', error);
    }
  }

  logoutUserByUID(userUID: string): void {
    // Fará a remoção das informações do usuário no localstorage
    const removedUserUID: string | null = this.userService.deleteUserFromLocalStorage(userUID);

    if(removedUserUID == null){
      throw new Error("Erro ao encerrar acesso do usuário");
    }

    // Se o usuário atual for o mesmo que está sendo removido o acesso, alterar para a outra conta que está acessada.
    if (this.currentUser && this.currentUser.UID === removedUserUID) {

      const otherUser : IUser | null = this.userService.getAnyUserFromLocalStorage();
      
      if(otherUser != null){
        this.switchUser(otherUser.UID);
      }

    }

    this.router.navigate(['/']);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {

    // Verificar se o usuário está logado
    if (this._authenticated) {
      return of(true);
    }

    if (this.isLoggedIn() == true) {
      return of(true);
    }

    if (this.accessToken != null && this.accessToken != '') {
      return of(true);
    }

    return of(false);
  }


  async loginCredential(username: string, password: string, email: string): Promise<void> {
    try {
      
      const data = await this.loginOnAzure(username, password);

      console.log(data);
      if (data.error) {
        throw new Error(data.error_description);
      }

      const profile = this.parseJwt(data.access_token);

      const user: IUser = {
        UID: profile.sub,
        TenantUID: environment.tenant_id, // Altere conforme necessário para obter o TenantUID
        userName: profile.name,
        firstName: profile.given_name,
        lastName: profile.family_name,
        isAdministrator: true, //user.profile.role === 'admin' , // Supondo que a role é um atributo do perfil
        memberType: 'member', // Defina conforme necessário
        tenants: [],
        email: email,
        accessInfo: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
          expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in),
        }
      }

      this.userService.addUserOnLocalStorage(user);
      this.currentUser = user;
      this._authenticated = true;

      // Verificar e registrar o usuário no banco de dados
      await this.checkAndRegisterUser(user);

      await this.sessionService.registerNewSession(user.UID, user.id, user.accessInfo.access_token);

      await this.tenantService.getAllTenantsAndSaveInLocalStorage(user.UID);
    } catch (error) {
      throw new Error("Erro durante o acesso a conta. "+error);
    }
  }

  async loginOnAzure(username: string, password: string){
    const response = await fetch('https://allystore.b2clogin.com/allystore.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_ropc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'password',
        'client_id': environment.client_id,
        'username': username,
        'password': password,
        'scope': environment.scope + " offline_access"
      })
    });

    return await response.json();
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  /**
   * Verifica se o token de acesso expirou e atualiza caso necessário
   */
  async handleTokenExpiration(): Promise<void> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const accessToken = currentUser.access_token;

    if (AuthUtils.isTokenExpired(accessToken)) {
      await this.refreshAccessToken();
    } else {
      // console.log('Token ainda é válido.');
    }
  }

  /**
   * Atualiza o token de acesso
   */
  async refreshAccessToken(): Promise<void> {
    const currentUser : IUser = this.userService.getCurrentUserFromStorage();
    if(!currentUser){
      throw new Error('CurrentUser não encontrado');
    }

    const refreshToken = currentUser.accessInfo.refresh_token;

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado no currentUser');
    }

    // Faça a requisição para renovar o access token usando o refresh token
    const response = await fetch('https://allystore.b2clogin.com/allystore.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_ropc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'client_id': environment.client_id,
        'refresh_token': refreshToken,
        'scope': environment.scope + " offline_access"
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();

    // Atualize o access token no currentUser e salve no localStorage
    currentUser.accessInfo.access_token = data.access_token;

    // Se houver um novo refresh token, atualize o currentUser
    if (data.refresh_token) {
      currentUser.accessInfo.refresh_token = data.refresh_token;
    }
    // Salve o currentUser atualizado no localStorage
    await this.userService.addUserOnLocalStorage(currentUser);
    this._authenticated = true;
    window.location.reload();
  }
}
