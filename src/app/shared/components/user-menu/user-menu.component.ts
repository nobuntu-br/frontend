import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'oidc-client-ts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  menuOpen = false;
  userInitial: string = ''; // Inicial padrão do usuário
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      // this.userInitial = user.profile.given_name.charAt(0).toUpperCase();
      // this.selectedUser = user;
    }
    // this.users = this.authService.getUsers();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openUserInNewTab(userId: string) {
    const url = `${window.location.origin}/?userId=${userId}`;
    window.open(url, '_blank');
  }

  addAccount() {
    // this.authService.loginWithPrompt();
  }

  logoutSelectedUser() {
    if (this.selectedUser) {
      this.authService.logoutUserByUID(this.selectedUser.profile.sub);
      // this.users = this.user.getUsers(); // Atualizar a lista de usuários
      this.router.navigate(['/']); // Redirecionar para a página inicial
    }
  }
  async logoutAllUsers() {
      await this.authService.logoutAllAccounts();
      this.router.navigate(['/']); // Redirecionar para a página inicial
  }

  selectUser(userId: string) {
    this.authService.switchUser(userId);
    // this.selectedUser = this.authService.getUser();
    if (this.selectedUser) {
      this.userInitial = this.selectedUser.profile.given_name.charAt(0).toUpperCase();
    }
    this.menuOpen = false;
  }

  logout(){
    console.log("Logout");
    // this.authService.logout();
  }
}
