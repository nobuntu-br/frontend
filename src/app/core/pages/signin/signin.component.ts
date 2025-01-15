import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { SessionService } from 'app/core/auth/session.service';
import { UserSessionService } from 'app/core/auth/user-session.service';
import { IUserSession } from 'app/core/auth/user.model';
import { TenantService } from 'app/core/tenant/tenant.service';
import { finalize, take } from 'rxjs';

/**
 * Estados da página
 */
enum SignInPageState {
  Redirecting,
  Error,
  SetEmail,
  SetPassword,
  CreatingAccount
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  /**
   * Formulário de acesso do usuário
   */
  passwordFormGroup: FormGroup = this._formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
  });

  emailFormGroup: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(120)]],
  });
  /**
   * Expondo o enum para o template
   */
  signInPageStates: typeof SignInPageState = SignInPageState;
  /**
   * Variável de controle de estado da página
   */
  pageState: SignInPageState = SignInPageState.SetEmail;
  /**
   * Variável de controle se está em carregamento a página
   */
  isLoading: boolean = false;
  /**
   * Controla a visibilidade da senha
   */
  passwordHide: boolean = false;
  passwordHideCheckBoxEnabled: boolean = true;

  constructor(
    public authService: AuthService,
    private userSessionService: UserSessionService,
    private tenantService: TenantService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
  }

  async checkEmailExist() {

    if (this.emailFormGroup.get("email").valid == false) {
      this.emailFormGroup.markAsDirty();
      return;
    }
    const email: string = this.emailFormGroup.value.email;

    this.emailFormGroup.get("email").disable();
    this.isLoading = true;

    this.authService.checkEmailExist(email).pipe(
      take(1),//O observador só irá existir até o momento que ouvir a primeira requisição, depois será eliminado

      //Quando o observable completa ou encontra um erro
      finalize(() => {
        this.isLoading = false;
        this.emailFormGroup.get("email").enable();
      }),
    ).subscribe({
      next: (_isValidEmail: boolean) => {

        if (_isValidEmail == true) {
          this.pageState = SignInPageState.SetPassword; // Se o email existe, vai para a etapa de senha
        } else {
          this.pageState = SignInPageState.CreatingAccount; // Se o email não existe, oferece criar uma conta
        }
      },
      error: (error) => {
        //TODO usar transloco para tradução dessas frases

        var checkEmailErrorMessage: string = "Erro ocorreu com os nossos serviços.";

        if (error.status === 404) {
          checkEmailErrorMessage = "Usuário não encontrado.";
        }

        if(error.status === 500){
          this.pageState = SignInPageState.Error;
        }

        this.snackBar.open(checkEmailErrorMessage, 'Fechar', {
          duration: 3000,
        });
      }
    });
    
  }

  async login() {

    if (this.passwordFormGroup.valid == false) {
      return;
    }

    //Desabilitar campos de entrada
    this.passwordFormGroup.get("password").disable();
    this.passwordHideCheckBoxEnabled = false;
    this.isLoading = true;

    let userSession: IUserSession;

    this.authService.signin(this.emailFormGroup.value.email, this.passwordFormGroup.value.password).pipe(take(1)).subscribe({
      next:(value) => {
        userSession = value;

        this.userSessionService.addUserSessionOnLocalStorage(userSession);
        this.userSessionService.setCurrentUserSessionOnLocalStorage(userSession);
        this.tenantService.getTenantsAndSaveInLocalStorage(userSession.user.UID);
    
        this.snackBar.open('Login bem-sucedido.', 'Fechar', {
          duration: 3000,
        }).afterDismissed().pipe(take(1)).subscribe({
          next: (value) => {
            this.router.navigate(['/home']);
          }
        });
      },

      error: (error) => {

        if(error.status === 500){
          this.pageState = SignInPageState.SetPassword;
        }

        this.passwordFormGroup.get("password").enable();
        this.passwordHideCheckBoxEnabled = true;
        this.isLoading = false;

        this.snackBar.open('Senha incorreta.', 'Fechar', {
          duration: 3000,
        });
      },
    })
  }

  toggleVisibility() {
    this.passwordHide = !this.passwordHide;  // Alterna entre mostrar e ocultar a senha
  }

  goToSignUpPage() {
    this.router.navigate(['signup']);
  }

  resetPassword() {
    this.router.navigate(['resetPassword']);
  }

  goBackToLogin() {
    this.pageState = SignInPageState.SetEmail;
  }

}