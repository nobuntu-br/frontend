import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, take } from 'rxjs';
import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client-ts';
import { environment } from 'environments/environment';
import { SessionService } from './session.service';
import { Session } from './session.model';
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { TenantService } from '../tenant/tenant.service';

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
    private http: HttpClient,
    private tenantService: TenantService
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
        p: "B2C_1_ROPC",
      },
      automaticSilentRenew: true, // Ativa a renovação automática do token
      silent_redirect_uri: environment.frontendUrl + '/silent-renew' // URL para renovação silenciosa

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
        //TODO obter os tenants aquit
        this.tenantService.getAllTenantsAndSaveInLocalStorage(this.currentUser.profile.aud as string);

      }
    } catch (error) {
      console.error('Error restoring user', error);
    }
  }

  loginSilent(): void {
    this.userManager.signinSilent().then(user => {
      this.currentUser = user;
      //TODO obter os tenants aqui
      this.tenantService.getAllTenantsAndSaveInLocalStorage(this.currentUser.profile.aud as string);
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
      var sessionData = sessionStorage.getItem('oidc.user:https://' + environment.provider + '/' + environment.tenant_id + '/' + environment.signInPolitical + '/v2.0/:' + environment.client_id) ?? '';
      const parsedData = JSON.parse(sessionData);
      return parsedData?.profile.oid || '';
    } catch (e) {
      return '';
    }

  }

  private async checkAndRegisterUser(user: User): Promise<void> {
    try {
      const existingUser = await this.userService.getByUID(user.profile.sub).toPromise();
      await this.registerNewSession(existingUser.UID, existingUser.id, user.access_token);

    } catch (error) {

      // Criar novo usuário
      const newUser: UserModel = {
        UID: user.profile.sub,
        TenantUID: environment.tenant_id, // Altere conforme necessário para obter o TenantUID
        username: user.profile.name,
        firstname: user.profile.given_name,
        lastname: user.profile.family_name,
        isAdministrator: true, //user.profile.role === 'admin' , // Supondo que a role é um atributo do perfil
        memberType: 'member', // Defina conforme necessário
      };
      const createdUser = await this.userService.create(newUser).toPromise();
      // Salvar na tabela de sessão
      await this.registerNewSession(newUser.UID, newUser.id, user.access_token);
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

      //TODO obter os tenants aqui
      this.tenantService.getAllTenantsAndSaveInLocalStorage(this.currentUser.profile.aud as string);

    } catch (error) {
      console.error('Error completing login', error);
    }
  }

  private storeUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    return this.currentUser != null && !this.currentUser.expired;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.profile.sub === userId) || null;
  }
  switchUser(userId: string): void {
    const users = this.getUsers();

    this.currentUser = users.find(user => user.profile.sub === userId) || null;
    console.log(this.currentUser.profile.given_name);
    if (this.currentUser) {
      this.userManager.storeUser(this.currentUser); // Atualizar o userManager com o novo usuário
      this.storeUser(this.currentUser);
      this.currentUser = this.currentUser;
    }
  }

  logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  async logoutAll(): Promise<void> {
    try {
      localStorage.clear();
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

    if (this.accessToken != null && this.accessToken != '') {
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

  registerNewSession(uid: string, userid: string, token: string): Observable<Session> {
    const newSession: Session = {
      finishSessionDate: new Date(),
      hashValidationLogin: "test",
      hashValidationLogout: "test",
      initialDate: new Date(),
      stayConnected: false,
      tenantUID: environment.tenant_id,
      accessToken: token,
      userUID: uid,
      accessTokenExpirationDate: new Date(),
      user: userid,
    }

    return this.sessionService.create(newSession);
  }


  // Método para redirecionar para a página de edição do perfil
  editProfile(): Promise<void> {
    const extraQueryParams = { p: environment.profileEditPolitical };
    this.userManager.signinRedirect({ extraQueryParams });
    return this.completeProfileEdit();
  }
  // Método para processar a resposta de edição do perfil
  async completeProfileEdit(): Promise<void> {
    try {
      this.currentUser = await this.userManager.signinRedirectCallback();
      this.storeUser(this.currentUser);
      console.log('Profile edit successful', this.currentUser);

      // Verificar e registrar o usuário no banco de dados
      await this.checkAndRegisterUser(this.currentUser);

      // Redirecionar para a página inicial ou outra página após a edição do perfil
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error completing profile edit', error);
    }
  }


  async loginCredential(username: string, password: string): Promise<void> {
    try {
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
      const data = await response.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error_description);
      }

      // Convert the token response to the User format expected by oidc-client-ts
      const user = new User({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
        profile: this.parseJwt(data.access_token),
        expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in)
      });
      user.profile.email = username



      await this.userManager.storeUser(user);
      this.storeUser(user);
      this.userService.addUserToArrayUsersLocalStorage(user);
      this.currentUser = user;
      this._authenticated = true;

      // Verificar e registrar o usuário no banco de dados
      await this.checkAndRegisterUser(user);

      //TODO obter os tenants aqui
      await this.tenantService.getAllTenantsAndSaveInLocalStorage(this.currentUser.profile.aud as string);
    } catch (error) {
      console.error('Login failed', error);
    }
    // return this.http.post('https://allystore.b2clogin.com/allystore.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_ropc', body.toString(), { headers });
  }
  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }



}
