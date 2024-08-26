import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

enum SignInPageState {
  Redirecting,
  Error,
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  pageState : SignInPageState;
  email: string = '';
  password: string = '';


  constructor(public authService: AuthService,
    private router: Router
  ) {
    this.pageState = SignInPageState.Redirecting;
  }

  ngOnInit(): void {
    //Redireciona o usuário para pagina de singIn da Azure
    // this.authService.login().catch((error)=>{
    //   // this.pageState = SignInPageState.Error;
    // })
  }


  async login() {
    await this.authService.loginCredential(this.email, this.password)
    this.router.navigate(['/'])
  }

  logout() {
    this.authService.logout();
  }

  createUser(){
    this.router.navigate(['createuser']);
  }

}
