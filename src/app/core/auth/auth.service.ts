import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { IUser, IUserSession, SignupDTO } from './user.model';
import { AuthUtils } from './auth.utils';
import { TenantService } from '../tenant/tenant.service';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  _authenticated: boolean = false;

  // protected http: HttpClient;

  private _currentUserSession: IUserSession | null = null;

  private url;

  /**
   * Constructor
   */
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userService: UserService,
    private userSessionService: UserSessionService,
    private tenantService: TenantService,
  ) {

    this.url = environment.backendUrl+"/api/authentication";
    // Recuperar o estado do usuário do localStorage ao iniciar
    // this.restoreUser();
  }

  get authenticated() {
    console.log("O usuário está com acesso: ", this._authenticated);
    return this._authenticated;
  }

  get accessToken(): string | null {
    if (this.currentUserSession == null) {
      return null;
    }
    return this.currentUserSession.tokens.accessToken;
  }

  get currentUserSession(): IUserSession | null {

    //Se não tiver sessão de usuário atual ele irá obter dados os localStorage
    if (this._currentUserSession == null) {
      this._currentUserSession = this.userSessionService.getAnyUserSessionFromLocalStorage();

      this.userSessionService.setCurrentUserSessionOnLocalStorage(this._currentUserSession);
    }

    // console.log("UserSession ativa no momento: ", this._currentUserSession);
    return this._currentUserSession;
  }

  set currentUserSession(userSession: IUserSession | null) {
    this._currentUserSession = userSession;
  }

  getUserSessions(): IUserSession[] | null {
    return this.userSessionService.getUserSessionsFromLocalstorage();
  }

  getInactiveUserSessions(): IUserSession[]| null{
    const currentUserSession = this.currentUserSession;
    const userSessions = this.getUserSessions();

    if(userSessions == null || currentUserSession == null){
      return null;
    }

    return userSessions.filter(userSession => userSession.user.UID != currentUserSession.user.UID);
  }

  isLoggedIn(): boolean {
    return this.currentUserSession != null && AuthUtils.isTokenExpired(this._currentUserSession.tokens.accessToken);
  }

  /**
   * Realiza a troca de sessão de usuário ativa no momento
   * @param userUID UID do usuário que sua sessão está ativa
   */
  switchUserSession(userUID: string): IUserSession {

    const userSessions: IUserSession[] = this.userSessionService.getUserSessionsFromLocalstorage();
    //Percorre as sessões de usuários salvas no local Storage.
    const _userSession: IUserSession = userSessions.find(_userSession => _userSession.user.UID === userUID) || null;

    if (_userSession != null) {
      //Caso for encontrado a sessão de usuário que se tem interesse em fazer uso, faz a troca para essa sessão de usuário que será a utilizada nas requisições
      this.currentUserSession = _userSession;
      //Armazena no local storage a nova sessão de usuário ativa
      this.userSessionService.setCurrentUserSessionOnLocalStorage(this.currentUserSession);

      return this.currentUserSession;
    }

    throw new Error("Não foi possível alterar o usuário ativo");

  }

  logoutAllAccounts() {
    this.userSessionService.deleteAllUserSessionsFromLocalStorage();
    this.currentUserSession = null;
    //TODO registrar o final de sessão de todos os usuários
  }

  logoutUserByUID(userUID: string): void {
    // Fará a remoção das informações do usuário no localstorage
    const removedUserUID: string | null = this.userSessionService.deleteUserSessionFromLocalStorage(userUID);

    if (removedUserUID == null) {
      throw new Error("Erro ao encerrar a sessão do usuário");
    }

    // Se o usuário atual for o mesmo que está sendo removido o acesso, alterar para a outra conta que está acessada.
    if (this.currentUserSession && this.currentUserSession.user.UID === removedUserUID) {

      const otherUserSession: IUserSession | null = this.userSessionService.getAnyUserSessionFromLocalStorage();

      if (otherUserSession != null) {
        this.switchUserSession(otherUserSession.user.UID);
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

  signin(email: string, password: string){
    console.log("Valores enviados ao entrar: ", email, password);

    return this.httpClient.post<IUserSession>(`${this.url}/signin`, { email, password });
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.url}/check-email-exist`, { email });
  }

  sendVerificationEmailCodeToEmail(email: string): Observable<any> {
    return this.httpClient.post(`${this.url}/send-verification-email-code`, { email });
  }
  
  sendPasswordResetLinkToEmail(email: string): Observable<any> {
    return this.httpClient.post(`${this.url}/send-password-reset-link-to-email`, { email });
  }

  resetPassword(password: string, resetPasswordToken: string){
    return this.httpClient.post<IUser>(`${this.url}/change-password`, { password, resetPasswordToken });
  }

  validateVerificationEmailCode(verificationEmailCode: string): Observable<any> {
    return this.httpClient.post(`${this.url}/validate-verification-email-code`, { verificationEmailCode });
  }

  signup(signupDTO : SignupDTO): Observable<IUser>{
    return this.httpClient.post<IUser>(`${this.url}/signup`,  signupDTO );
  }

  /**
   * Verifica se o token de acesso expirou e atualiza caso necessário
   */
  async handleTokenExpiration(): Promise<void> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const accessToken = currentUser.access_token;

    if (AuthUtils.isTokenExpired(accessToken)) {
      await this.refreshAccessToken();
    }
  }

  /**
   * Atualiza o token de acesso
   */
  async refreshAccessToken(): Promise<void> {
    const currentUserSession: IUserSession = this.userSessionService.getCurrentUserSessionFromLocalStorage();

    if (!currentUserSession) {
      throw new Error('CurrentUserSession não encontrado');
    }

    const refreshToken = currentUserSession.tokens.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado no currentUserSession');
    }

    const accessToken: string = await firstValueFrom(this.userService.getNewAccessToken(refreshToken));

    currentUserSession.tokens.accessToken = accessToken;

    this.userSessionService.addUserSessionOnLocalStorage(currentUserSession);

    // Faça a requisição para renovar o access token usando o refresh token
    // const response = await fetch('https://allystore.b2clogin.com/allystore.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_ropc', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   body: new URLSearchParams({
    //     'grant_type': 'refresh_token',
    //     'client_id': environment.client_id,
    //     'refresh_token': refreshToken,
    //     'scope': environment.scope + " offline_access"
    //   })
    // });

    // if (!response.error) {
    //   throw new Error('Failed to refresh access token');
    // }

    // const data = await response.json();

    // Atualize o access token no currentUser e salve no localStorage
    // this.currentUserSession..accessToken = data.access_token;

    // Se houver um novo refresh token, atualize o currentUser
    // if (data.refresh_token) {
    //   currentUser.accessInfo.refreshToken = data.refresh_token;
    // }
    // Salve o currentUser atualizado no localStorage
    // await this.userService.addUserOnLocalStorage(currentUser);
    this._authenticated = true;
    window.location.reload();
  }
}