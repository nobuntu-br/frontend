import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, take } from 'rxjs';
import { UserManager, UserManagerSettings, User } from 'oidc-client-ts';
import { environment } from 'environments/environment';
import { SessionService } from './session.service';
import { Session } from './session.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _authenticated: boolean = false;

  claims: any;
  authorizationResponse;

  private userManager: UserManager;
  private user: User | null = null;

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private sessionService: SessionService,
  ) {
    
    const settings: UserManagerSettings = {
      authority: environment.authority,
      client_id: environment.client_id,
      redirect_uri: environment.redirect_uri,
      post_logout_redirect_uri: environment.post_logout_redirect_uri,
      response_type: 'code',
      scope: environment.scope,
      
      filterProtocolClaims: true,
      loadUserInfo: false,

      extraQueryParams: {
        p: environment.signInPolitical,
      },
    }
    
    this.userManager = new UserManager(settings);
  }

  get authenticated() {
    return this._authenticated;
  }

  get accessToken(): string {
    var sessionData = sessionStorage.getItem('oidc.user:https://'+environment.provider+'/'+environment.tenant_id+'/'+environment.signInPolitical+'/v2.0/:'+environment.client_id) ?? '';
    try {
      const parsedData = JSON.parse(sessionData);
      return parsedData?.access_token || '';
    } catch (e) {
      return '';
    }
   
  }


  get userUID(): string {
    var sessionData = sessionStorage.getItem('oidc.user:https://'+environment.provider+'/'+environment.tenant_id+'/'+environment.signInPolitical+'/v2.0/:'+environment.client_id);
    try {
      const parsedData = JSON.parse(sessionData);
      return parsedData?.profile.sub || '';
    } catch (e) {
      return '';
    }
  }

  login(): void {
    this.userManager.signinRedirect();
  }

  async completeAuthentication(): Promise<void> {
    this.user = await this.userManager.signinRedirectCallback();
    await this.userManager.storeUser(this.user);
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getUser(): User | null {
    return this.user;
  }

  public logout(): void {
    this.userManager.signoutRedirect();
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {

    // Verificar se o usuário está logado
    // console.log("Está sendo feito a verificação do guard");
    // console.log("authenticated :", this._authenticated);
    // if (this._authenticated) {
    //   return of(true);
    // }
    // // Verificar se ele não tem o accessToken
    // console.log("Access token: ", this.accessToken);
    // if (!this.accessToken) {
    //   return of(false)
    // }
    // // Verificação se o token expirou
    // if (AuthUtils.isTokenExpired(this.accessToken) == false) {
    //   return of(true);
    // }

    if (this.isLoggedIn() == true) {
      return of(true);
    }

    return of(false);
    // If the access token exists and it didn't expire, sign in using it
    // return this.signInUsingToken();
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

  registerNewSession(userUID: string, userID: string): Observable<Session> {
    const newSession: Session = {
      finishSessionDate: new Date(),
      hashValidationLogin: "test",
      hashValidationLogout: "test",
      initialDate: new Date(),
      stayConnected: false,
      tenantUID: environment.tenant_id,
      accessToken: this.accessToken,
      userUID: userUID,
      accessTokenExpirationDate: new Date(),
      user: userID,
    }

    return this.sessionService.create(newSession);
  }

}
