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
  userName: string = ''; // Inicial padrão do usuário
  users: User[] = [];
  currentUser: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkUser();
    const user = this.authService.currentUser;
    if (user) {
      // this.userName = user.profile.given_name;
      this.userName = user.firstName;
      // this.currentUser = user;
    }
    // this.users = this.authService.getUsers();
  }

  checkUser() {
    this.authService.check().subscribe((res) => {
      if (res) {
        this.isLoggedIn = true;
      }
    });
  }

  redirectToSignInPage() {
    this.saveRedirectURL(this.router.url);
    this.router.navigate(['signin']);
  }

  private saveRedirectURL(redirectURL: string) {
    localStorage.setItem("redirectURL", redirectURL);
  }
  addAccount() {
    this.router.navigate(['signin']);
  }
  async logoutAllUsers() {
    await this.authService.logoutAllAccounts();
    this.router.navigate(['/']); // Redirecionar para a página inicial
  }
  openUserInNewTab(userId: string) {
    const url = `${window.location.origin}/?userId=${userId}`;
    window.open(url, '_blank');
  }
  configurarUsuario(): void {
    this.router.navigate(['editProfile']);
  }
  createUser(): void {
    this.router.navigate(['createuser'])
  }
  isCurrentUser(user: any): boolean {
    return this.currentUser && user.profile.email === this.currentUser.profile.email;
  }
}
