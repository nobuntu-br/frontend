import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { IUser } from 'app/core/auth/user.model';
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
  users: IUser[] = [];
  /**
   * Sessão dos usuários inativos
   */
  inactiveUsers: IUser[] = [];
  /**
   * Sessão do usuário atual que está realizando as requisições
   */
  currentUser: IUser;
  userProfilePhotoEnabled: boolean = false;
  menus: {id: string, fileName: string}[] = JSON.parse(localStorage.getItem('menus') || '[]');
  currentMenuId: string = JSON.parse(localStorage.getItem('currentMenu') || '[]');
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateUserState();
    //Obtem a sessão de usuário atual para manipular o componente
    this.currentUser = this.authService.currentUser;
    //Obtem informação dos usuário com acesso
    this.users = this.authService.getUsers();
    //Obtem informações dos usuários com acesso mas não ativos
    this.inactiveUsers = this.authService.getInactiveUsers();

    //TODO fazer isso só uma vez após o login pra não dar problema com a Azure
    // this.getUserProfilePhoto(this.currentUserSession.user.UID);

  }

  checkUserExpired(user: IUser) {
    
  }

  setCurrentMenu(menu: {id: string, fileName: string}) {
    localStorage.setItem('currentMenu', JSON.stringify(menu));
    window.location.reload();
  }

  updateUserState() {
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

  goToManageAccountPage(): void{
    
  }

  isCurrentUser(user: IUser): boolean {
    if (this.currentUser.UID == user.UID) {
      return true;
    }

    return false;
  }

  switchCurrentUser(user: IUser) {

    //Se por acaso tentar mudar a sessão do usuário para o mesmo usuário, não irá poder fazer isso
    if (this.isCurrentUser(user) == true) {
      return null;
    }

    this.authService.switchUser(user.UID);

    //Atualiza o sessão de usuário atual
    this.currentUser = this.authService.currentUser;
    //Atualiza a lista de sessões de usuário inativas
    this.inactiveUsers = this.authService.getInactiveUsers();

    window.location.reload();
  }

  signOutUser(user: IUser) {
    this.authService.signOutUser(user);
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
        this.userProfilePhotoEnabled = true;
      },
      error: (error) => {
        this.userProfilePhotoEnabled = false;
      },
    })
  }
}
