import { Component, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService) {
    this.pageState = SignInPageState.Redirecting;
  }

  ngOnInit(): void {
    //Redireciona o usuário para pagina de singIn da Azure
    this.authService.login().catch((error)=>{
      // this.pageState = SignInPageState.Error;
    })
  }
}
