import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, take } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { IUser, IUserSession, SignupDTO } from './user.model';
import { AuthUtils } from './auth.utils';
import { TenantService } from '../tenant/tenant.service';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { LocalStorageService } from 'app/shared/services/local-storage.service';


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
    private userSessionService: UserSessionService,
    private tenantService: TenantService,
  ) {

    this.url = environment.backendUrl + "/api/authentication";
    // Recuperar o estado do usuário do localStorage ao iniciar
    // this.restoreUser();
  }

  get authenticated() {
    return this._authenticated;
  }

  get currentUserSession(): IUserSession | null {

    //Se não tiver sessão de usuário atual ele irá obter dados os localStorage
    if (this._currentUserSession == null) {

      this.currentUserSession = this.userSessionService.getAnyUserSessionFromLocalStorage();

      this.userSessionService.setCurrentUserSessionOnLocalStorage(this._currentUserSession);
    }

    return this._currentUserSession;
  }

  set currentUserSession(userSession: IUserSession | null) {
    this._currentUserSession = userSession;
  }

  getUserSessions(): IUserSession[] | null {
    return this.userSessionService.getUserSessionsFromLocalstorage();
  }

  getInactiveUserSessions(): IUserSession[] | null {
    const currentUserSession = this.currentUserSession;
    const userSessions = this.getUserSessions();

    if (userSessions == null || currentUserSession == null) {
      return null;
    }

    return userSessions.filter(userSession => userSession.user.UID != currentUserSession.user.UID);
  }

  isLoggedIn(): boolean {
    // return this.currentUserSession != null && AuthUtils.isTokenExpired(this._currentUserSession.tokens.accessToken);
    return this.currentUserSession != null;
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

  async signOutUser(userSession: IUserSession): Promise<void> {
    try {
      await firstValueFrom(this.signout().pipe(take(1)));
      this.userSessionService.deleteUserSessionFromLocalStorage(userSession.user.UID);
      this.userSessionService.deleteCurrentUserSessionFromLocalStorage();
      this.currentUserSession = null;
    } catch (error) {
      console.error("Error to signOut user.");
    }
  }

  async signOutAllUsers(): Promise<void> {
    const userSessions = this.userSessionService.getUserSessionsFromLocalstorage();

    for (const userSession of userSessions) {
      try {
        // Aguarda o signout ser concluído antes de passar para o próximo usuário
        await firstValueFrom(this.signout().pipe(take(1)));

        // Limpa os dados do usuário do localStorage
        this.userSessionService.deleteUserSessionFromLocalStorage(userSession.user.UID);
        this.userSessionService.deleteCurrentUserSessionFromLocalStorage();
        this.currentUserSession = null;


      } catch (error) {
        console.error("Error to signOut user.");
      }
    }

    //Limpa todas as sessões do LocalStorage
    this.userSessionService.deleteAllUserSessionsFromLocalStorage();
    this.currentUserSession = null;
    this.tenantService.deleteAllTenantsFromLocalStorage();

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

    // if (this.accessToken != null && this.accessToken != '') {
    //   return of(true);
    // }

    return of(false);
  }

  signin(email: string, password: string) {
    return this.httpClient.post<IUserSession>(`${this.url}/signin`, { email, password }, { withCredentials: true });//"{withCredentials: true}" instrui o Angular a incluir cookies em requisições HTTP
  }

  signup(signupDTO: SignupDTO): Observable<IUser> {
    return this.httpClient.post<IUser>(`${this.url}/signup`, signupDTO);
  }

  signout() {
    return this.httpClient.post<IUser>(`${this.url}/signout`, {});
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

  resetPassword(password: string, resetPasswordToken: string) {
    return this.httpClient.post<IUser>(`${this.url}/change-password`, { password, resetPasswordToken });
  }

  validateVerificationEmailCode(verificationEmailCode: string): Observable<any> {
    return this.httpClient.post(`${this.url}/validate-verification-email-code`, { verificationEmailCode });
  }

  refreshAccessToken(): Observable<string> {
    return this.httpClient.get<string>(`${this.url}/refresh-token`);
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

}