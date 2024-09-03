import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ApplicationService } from 'app/shared/services/application.service';

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
  pageState: SignInPageState;
  email: string = '';
  password: string = '';
  userPrincipalName: string = '';
  step: number = 1; // Controla o passo atual (1: Email, 2: Senha, 3: Criar Conta)

  // Expondo o enum para o template
  SignInPageState = SignInPageState;

  constructor(
    public authService: AuthService,
    private router: Router,
    private applicationService: ApplicationService
  ) {
    this.pageState = SignInPageState.Redirecting;
  }

  ngOnInit(): void {
    // Você pode iniciar verificações automáticas aqui, se necessário
  }

  async onEmailSubmit() {
    try {
      // const response = await this.applicationService.checkEmail(this.email).toPromise();
      // if (response.exists) {
        this.step = 2; // Se o email existe, vai para a etapa de senha
      // } else {
        // this.step = 3; // Se o email não existe, oferece criar uma conta
      // }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      this.pageState = SignInPageState.Error;
    }
  }

  async login() {
    try {
      await this.authService.loginCredential(this.email, this.password, this.email);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      this.pageState = SignInPageState.Error;
    }
  }

  logout() {
    this.authService.logout();
  }

  createUser() {
    this.router.navigate(['createuser']);
  }

  resetPassword() {
    this.router.navigate(['resetPassword']);
  }
  goBackToLogin() {
    this.step = 1; // Volta para a etapa de inserção do email
  }

}
