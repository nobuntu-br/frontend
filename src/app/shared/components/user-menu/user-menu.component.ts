import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { IUserSession } from 'app/core/auth/user.model';
import { UserService } from 'app/core/auth/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  /**
   * Controla se o painel de dados das contas de usuários está aberto
   */
  panelOpenState = false;
  /**
   * Controla o estado de acesso
   */
  isLoggedIn: boolean = false;
  /**
   * Sessão dos usuários
   */
  userSessions: IUserSession[] = [];
  /**
   * Sessão dos usuários inativos
   */
  inactiveUserSessions: IUserSession[] = [];
  /**
   * Sessão do usuário atual que está realizando as requisições
   */
  currentUserSession: IUserSession;
  userProfilePhotoEnabled: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateUserSessionState();
    //Obtem a sessão de usuário atual para manipular o componente
    this.currentUserSession = this.authService.currentUserSession;
    //Obtem informação dos usuário com acesso
    this.userSessions = this.authService.getUserSessions();
    //Obtem informações dos usuários com acesso mas não ativos
    this.inactiveUserSessions = this.authService.getInactiveUserSessions();

    this.getUserProfilePhoto(this.currentUserSession.user.UID);

  }

  checkUserSessionExpired(userSession: IUserSession): boolean {
    if (userSession.tokens == null || userSession.tokens.accessToken == null) return true;
    return AuthUtils.isTokenExpired(userSession.tokens.accessToken);
  }

  updateUserSessionState() {
    this.authService.check().subscribe((res) => {
      if (res) {
        this.isLoggedIn = true;
      }
    });
  }

  goToSignInPage() {
    this.router.navigate(['signin']);
  }

  goToEditUserPage(): void {
    this.router.navigate(['editProfile']);
  }

  isCurrentUserSession(userSession: IUserSession): boolean {
    if (this.currentUserSession.user.UID == userSession.user.UID) {
      return true;
    }

    return false;
  }

  switchCurrentUserSession(userSession: IUserSession) {

    //Se por acaso tentar mudar a sessão do usuário para o mesmo usuário, não irá poder fazer isso
    if (this.isCurrentUserSession(userSession) == true) {
      return null;
    }

    this.authService.switchUserSession(userSession.user.UID);

    //Atualiza o sessão de usuário atual
    this.currentUserSession = this.authService.currentUserSession;
    //Atualiza a lista de sessões de usuário inativas
    this.inactiveUserSessions = this.authService.getInactiveUserSessions();

    window.location.reload();
  }

  signOutUser(userSession: IUserSession) {
    this.authService.signOutUser(userSession);
    this.router.navigate(['/signin']);
  }

  signOutAllUsers() {
    this.authService.signOutAllUsers().then(() => {
      this.router.navigate(['/signin']); // Redirecionar para a página inicial
    });
  }

  async getUserProfilePhoto(userUID: string) {
    this.userService.getUserProfilePhoto(userUID).pipe(take(2)).subscribe({
      next: (value) => {
        console.log("resposta ao obter imagem: ", value);
        this.userProfilePhotoEnabled = true;
      },
      error: (error) => {
        console.log("erro ao obter foto do perfil: ", error);
        this.userProfilePhotoEnabled = false;
      },
    })
  }
}
