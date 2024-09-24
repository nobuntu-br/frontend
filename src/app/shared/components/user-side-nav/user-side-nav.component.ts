import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { IUser } from 'app/core/auth/user.model';

@Component({
  selector: 'app-user-side-nav',
  templateUrl: './user-side-nav.component.html',
  styleUrls: ['./user-side-nav.component.scss']
})
export class UserSideNavComponent implements OnInit {

  isLoggedIn: boolean = false;
  userName: string = ''; // Inicial padrão do usuário
  users: IUser[] = [];
  currentUser: IUser;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkUser();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '[]');

    if (this.currentUser) {
      // this.userName = user.profile.given_name;
      this.userName = this.currentUser.firstName;
      // this.currentUser = user;
    }
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
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
    this.router.navigate(['/signin']); // Redirecionar para a página inicial
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
  isCurrentUser(user: IUser): boolean {
    return this.currentUser && user.email === this.currentUser.email;
  }
}
