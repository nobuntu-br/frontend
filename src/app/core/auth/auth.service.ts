import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, take } from 'rxjs';
import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client-ts';
import { environment } from 'environments/environment';
import { SessionService } from './session.service';
import { Session } from './session.model';
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  _authenticated: boolean = false;

  claims: any;
  authorizationResponse;

  private userManager: UserManager;
  private currentUser: User | null = null;

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private sessionService: SessionService,
    private router: Router,
    private userService: UserService,
  ) {

    const settings: UserManagerSettings = {
      authority: environment.authority,
      client_id: environment.client_id,
      redirect_uri: environment.frontendUrl + '/' + environment.redirect_uri,
      post_logout_redirect_uri: environment.frontendUrl + '/' + environment.post_logout_redirect_uri,
      response_type: 'code',
      scope: environment.scope,
      
      filterProtocolClaims: true,
      loadUserInfo: false,
      userStore: new WebStorageStateStore({ store: window.localStorage }), // Armazena no localStorage
      extraQueryParams: {
        p: environment.signInPolitical,
      },
      automaticSilentRenew: true, // Ativa a renovação automática do token
      silent_redirect_uri: environment.frontendUrl+'/silent-renew' // URL para renovação silenciosa

    }
    
    this.userManager = new UserManager(settings);

    // Recuperar o estado do usuário do localStorage ao iniciar
    this.restoreUser();

     // Adicionar eventos de renovação automática
     this.userManager.events.addAccessTokenExpired(() => {
      this.loginSilent();
    });

    this.userManager.events.addSilentRenewError(error => {
      console.error('Silent renew error', error);
    });

  }
  private async restoreUser(): Promise<void> {
    try {
      const user = await this.userManager.getUser();
      if (user) {
        this.currentUser = user;
        this._authenticated = true;
        this.userManager.storeUser(user);
      }
    } catch (error) {
      console.error('Error restoring user', error);
    }
  }
  loginSilent(): void {
    this.userManager.signinSilent().then(user => {
      this.currentUser = user;
    }).catch(error => {
      console.error('Silent login error', error);
      // Pode redirecionar para login se necessário
      this.login();
    });
  }
  
  get authenticated() {
    return this._authenticated;
  }

  // get accessToken(): string {

  //   try {
  //     var sessionData = sessionStorage.getItem('oidc.user:https://'+environment.provider+'/'+environment.tenant_id+'/'+environment.signInPolitical+'/v2.0/:'+environment.client_id) ?? '';
  //     const parsedData = JSON.parse(sessionData);
  //     return parsedData?.access_token || '';
  //   } catch (e) {
  //     return null;
  //   }

  // }

  get accessToken(): string | null {
    return this.currentUser?.access_token ?? null;
  }

  get userUID(): string {

    try {
      var sessionData = sessionStorage.getItem('oidc.user:https://'+environment.provider+'/'+environment.tenant_id+'/'+environment.signInPolitical+'/v2.0/:'+environment.client_id) ?? '';
      const parsedData = JSON.parse(sessionData);
      return parsedData?.profile.oid || '';
    } catch (e) {
      return '';
    }
    
  }

  private async checkAndRegisterUser(user: User): Promise<void> {
    try {
      const existingUser = await this.userService.getByUID(user.profile.sub).toPromise();
        await this.registerNewSession(existingUser.UID,existingUser.id);

    } catch (error) {

              // Criar novo usuário
              const newUser: UserModel = {
                UID: user.profile.sub,
                TenantUID: environment.tenant_id, // Altere conforme necessário para obter o TenantUID
                username: user.profile.name,
                firstName: user.profile.given_name,
                lastName: user.profile.family_name,
                isAdministrator: true, //user.profile.role === 'admin' , // Supondo que a role é um atributo do perfil
                memberType: 'member', // Defina conforme necessário
                tenants: [] // Defina conforme necessário
              };
              const createdUser = await this.userService.create(newUser).toPromise();
              // Salvar na tabela de sessão
              await this.registerNewSession(newUser.UID,newUser.id);
    }
  }


  login(): Promise<void> {
    console.log(this.userManager)
    return this.userManager.signinRedirect();
  }
  loginWithPrompt(): Promise<void> {
    const extraQueryParams = { prompt: 'login' };
    return this.userManager.signinRedirect({ extraQueryParams });
  }
  switchAccount(): void {
    console.log(
     this.userManager.signinRedirect({ prompt: 'select_account' }));
  }

  async completeAuthentication(): Promise<void> {
    try {
      this.currentUser = await this.userManager.signinRedirectCallback();
      this.storeUser(this.currentUser);
      console.log('Login successful', this.currentUser);

      // Verificar e registrar o usuário no banco de dados
      await this.checkAndRegisterUser(this.currentUser);

    } catch (error) {
      console.error('Error completing login', error);
    }
  }
  
  storeUser(user: User) {
    const users = JSON.parse(localStorage.getItem('authenticatedUsers') || '[]');
    const userIndex = users.findIndex(u => u.profile.sub === user.profile.sub);
    if (userIndex === -1) {
      users.push(user);
    } else {
      users[userIndex] = user;
    }
    localStorage.setItem('authenticatedUsers', JSON.stringify(users));
  }
  isLoggedIn(): boolean {
    return this.currentUser != null && !this.currentUser.expired;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem('authenticatedUsers') || '[]');
  }
  getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.profile.sub === userId) || null;
  }
  switchUser(userId: string): void {
    const users = this.getUsers();
    const user: User = users.find(u => u.id_token === userId);
    this.currentUser = user || null;
    if (this.currentUser) {
      this.storeUser(this.currentUser);
    }
  }

  logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  async logoutAll(): Promise<void> {
    try {
      localStorage.removeItem(`oidc.user:${this.userManager.settings.authority}:${this.userManager.settings.client_id}`);
      localStorage.removeItem('authenticatedUsers');
      this.currentUser = null;
      await this.userManager.signoutRedirect();
    } catch (error) {
      console.error('Error during logout', error);
    }
  }
  logoutUserById(userId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.profile.sub === userId);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      localStorage.setItem('authenticatedUsers', JSON.stringify(users));
      // Se o usuário atual for o mesmo que está sendo deslogado, deslogar globalmente
      if (this.currentUser && this.currentUser.profile.sub === userId) {
        this.logout();
      } else {
        this.router.navigate(['/']);
      }
    }
  }


  // public async logoutRedirect(): Promise<void> {
  //   this.logout();
  //   localStorage.setItem("redirectURL", window.location.pathname);
  //   await this.userManager.signoutRedirect();
  // }

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

    if(this.accessToken != null && this.accessToken != ''){
      return of(true);
    }

    return of(false);
  }

  /**
   * Verifica se a conta registrada no server provider está registrada para a aplicaçào atual
   * @param userUID
   * @returns 
   */
  checkAccountIsRegisteredOnApp(userUID: string): Observable<object> {
    return this._httpClient.get<object>(environment.backendUrl + "/api/user/uid/" + userUID);
  }

  checkExistAnyUserAccount(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<object[]>(environment.backendUrl + "/api/user/").pipe(take(1)).subscribe({
        next: (data: object[]) => {

          console.log("Contas de usuários existentes: ", data);
          if (data == null || data.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }

        },
        error: (error) => {

          console.warn(error);
          reject(new Error('Erro ao verificar se existe algum usuário registrado na aplicação'));

        }
      })
    });
  }

  registerNewSession(uid: string, userid: string): Observable<Session> {
    const newSession: Session = {
      finishSessionDate: new Date(),
      hashValidationLogin: "test",
      hashValidationLogout: "test",
      initialDate: new Date(),
      stayConnected: false,
      tenantUID: environment.tenant_id,
      accessToken: this.accessToken,
      userUID: uid,
      accessTokenExpirationDate: new Date(),
      user: userid,
    }

    return this.sessionService.create(newSession);
  }

}
