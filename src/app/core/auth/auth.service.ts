import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, take, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRoute, Router } from '@angular/router';
import { authCodeFlowConfig } from './authconfig';
import { environment } from 'environments/environment';

// @Injectable()
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _authenticated: boolean = false;

  claims: any;
  authorizationResponse;

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private oauthService: OAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.configureSSO();
  }

  configureSSO() {
    this.oauthService.configure(authCodeFlowConfig);

    // this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService.events.subscribe((event: OAuthEvent) => {
      console.log("O evento aconteceu: ", event);

      // if (event.type === 'token_received') {
      //   console.debug('logged in');
      // }
    });


    // const url = authCodeFlowConfig.issuer + '.well-known/openid-configuration?p=b2c_1_susi1';
    // this.oauthService.setupAutomaticSilentRefresh(); //TODO ver sobre isso, pq tem os eventos lá que recebe os token
    // this.oauthService.loadDiscoveryDocumentAndLogin();
    //this.oauthService.loadDiscoveryDocument(url);//TODO error
  }

  get authenticated() {
    return this._authenticated;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  setAccessToken(token: string) {
    this._authenticated = true;
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  set refreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(authorizationCode: string): Observable<any> {

    const getAccessTokenParams = {
      grant_type: environment.grantType,
      client_id: environment.clientId,
      scope: environment.providerMicrosoftUri+environment.scope,
      redirect_uri: environment.redirectUri,
      code: authorizationCode,
      code_verifier: this.codeVerifier
    }

    let tenantId: string = environment.tenantId;

    let getAccessTokenUri: string = environment.providerUriB2C + "/" + environment.tenantId + "/B2C_1_susi1/oauth2/v2.0/token";
    // let getAccessTokenUri: string = "https://allystore.b2clogin.com/" + tenantId + "/B2C_1_susi1/oauth2/v2.0/token";

    /*
    this._httpClient.get<any>(getAccessTokenUri, { params: getAccessTokenParams }).pipe(take(1)).subscribe({
      next: (data) => {
        console.log("Dados retornados ao obter o access token: ", data);

        // this.saveAccessToken(data.access_token);
        this.accessToken = data.access_token;
        return data;
        // this.saveRefreshToken(data.refresh_token);
      },
      error: (error) => {
        console.warn(error);
        return null;
      }
    });
    */

    return this._httpClient.get<any>(getAccessTokenUri, { params: getAccessTokenParams });
  }

  getAuthenticationCode() {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {

      this.authorizationResponse = {
        code: params['code'],
        state: params['state'],
      };

    });
  }

  /**
   * Adicionado
   */
  get codeVerifier(): string {
    return sessionStorage.getItem('PKCE_verifier');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(): Observable<any> {

    if (this._authenticated) {
      return throwError('User is already logged in.');
    }

    const url = authCodeFlowConfig.issuer + '.well-known/openid-configuration?p=b2c_1_susi1';

    this.oauthService.loadDiscoveryDocument(url).then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.initCodeFlow();//Chama a pagina para realizar o logIn
      }
    })

  }



  /**
   * Sign in using the access token
   */
  /*
  signInUsingToken(): Observable<any> {
      // Sign in using the token
      return this._httpClient.post('api/auth/sign-in-with-token', {
          accessToken: this.accessToken
      }).pipe(
          catchError(() =>

              // Return false
              of(false)
          ),
          switchMap((response: any) => {

              // Replace the access token with the new one if it's available on
              // the response object.
              //
              // This is an added optional step for better security. Once you sign
              // in using the token, you should generate a new one on the server
              // side and attach it to the response object. Then the following
              // piece of code can replace the token with the refreshed one.
              if (response.accessToken) {
                  this.accessToken = response.accessToken;
              }

              // Set the authenticated flag to true
              this._authenticated = true;

              // Store the user on the user service
              // this._userService.user = response.user;

              // Return true
              return of(true);
          })
      );
  }
  */

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');

    // Set the authenticated flag to false
    this._authenticated = false;

    this.oauthService.logOut();//Adicionado

    // Return the observable
    return of(true);
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(): Observable<any> {
    //TODO direcionar para pagina de criação de conta
    return throwError("Método não implementado ainda");
  }

  /**
   * Unlock session
   * @param credentials
   */
  unlockSession(): Observable<any> {
    //TODO implementar o método
    return throwError("Método não implementado ainda");
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {

    // Verificar se o usuário está logado
    // console.log("authenticated :", this._authenticated);
    if (this._authenticated) {
      return of(true);
    }

    // Verificar se ele não tem o accessToken
    if (!this.accessToken) {
      return of(false)
    }

    // Verificação se o token expirou
    if (AuthUtils.isTokenExpired(this.accessToken) == false) {
      return of(true);
    }

    return of(false);
    // If the access token exists and it didn't expire, sign in using it
    // return this.signInUsingToken();
  }

  checkAccountOnApp(){
    //TODO vai precisar decodificar o accessToken para obter o UID
    
    //Depois usar o UID na pesquisa pra ver se o usuário está cadastrado nessa aplicação
    this._httpClient.get<object>(environment.backendUrl+"/api/users",);

    //se o usuário está cadastrado nessa aplicação, permite o acesso no componente callback para retornar para página de interesse
  }

  

}
