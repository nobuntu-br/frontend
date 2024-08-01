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
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkUser();
    console.log(this.users);
    console.log(this.selectUser);
  }

  checkUser() {
    this.authService.check().subscribe((res) => {
      if (res) {
        this.isLoggedIn = true;
        this.users = this.authService.getUsers();
        this.selectedUser = this.authService.getUser();
        console.log(this.selectedUser);
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

  logout(){
    // this.authService.logoutRedirect();
  }

}
