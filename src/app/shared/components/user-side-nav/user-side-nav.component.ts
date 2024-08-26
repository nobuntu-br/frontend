import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'oidc-client-ts';

@Component({
  selector: 'app-user-side-nav',
  templateUrl: './user-side-nav.component.html',
  styleUrls: ['./user-side-nav.component.scss']
})
export class UserSideNavComponent implements OnInit {

  isLoggedIn: boolean = false;

  selectedUser: User | null = null;
  userName: string = ''; // Inicial padrão do usuário
  users: User[] = [];
  currentUser: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkUser();
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.profile.given_name
      this.currentUser = user;
    }
    this.users = this.authService.getUsers();
  }

  checkUser() {
    this.authService.check().subscribe((res) => {
      if (res) {
        this.isLoggedIn = true;
        this.users = this.authService.getUsers();
        this.selectedUser = this.authService.getUser();
      }
    });
  }

  redirectToSignInPage() {
    this.saveRedirectURL(this.router.url);
    this.router.navigate(['signin']);
  }

   addAccount() {
    this.authService.loginWithPrompt();
  }

  logoutSelectedUser() {
    if (this.selectedUser) {
      this.authService.logoutUserById(this.selectedUser.profile.sub);
      this.users = this.authService.getUsers(); // Atualizar a lista de usuários
      this.router.navigate(['/']); // Redirecionar para a página inicial
    }
  }
  async logoutAllUsers() {
      await this.authService.logoutAll();
      this.router.navigate(['/']); // Redirecionar para a página inicial
  }

  selectUser(userId: string) {
    this.authService.switchUser(userId);
    this.checkUser();
  }

  private saveRedirectURL(redirectURL: string) {
    localStorage.setItem("redirectURL", redirectURL);
  }
  addAccount() {
    this.router.navigate(['signin']);
  }
  async logoutAllUsers() {
    await this.authService.logoutAll();
    this.router.navigate(['/']); // Redirecionar para a página inicial
}
openUserInNewTab(userId: string) {
  const url = `${window.location.origin}/?userId=${userId}`;
  window.open(url, '_blank');
}
  configurarUsuario(): void {
    // Redirecionar para a página de edição de perfil do Azure AD B2C
    this.authService.editProfile().catch(error => {
      console.error('Error initiating profile edit', error);
    });
  }

  isCurrentUser(user: any): boolean {
    return this.currentUser && user.profile.email === this.currentUser.profile.email;
  }
}
