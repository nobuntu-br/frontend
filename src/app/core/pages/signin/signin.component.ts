import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/auth/user.service';
import { finalize, lastValueFrom, take, tap } from 'rxjs';

enum SignInPageState {
  Redirecting,
  Error,
  EmailVerification,
  PasswordVerification,
  CreatingAccount
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInUserFormGroup: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    password: ['', [Validators.required]],
    userPrincipalName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
  });

  pageState: SignInPageState = SignInPageState.EmailVerification;
  // Expondo o enum para o template
  signInPageStates: typeof SignInPageState = SignInPageState;

  isLoading: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {

  }

  async onEmailSubmit() {
    try {
      this.isLoading = true;

      this.userService.checkEmailExist(this.signInUserFormGroup.value.email).pipe(
        take(1),
        //Quando o observable completa ou encontra um erro
        finalize(() => {
          this.isLoading = false;
        }),
      ).subscribe({
        next: (_isValidEmail: boolean) => {
          if (_isValidEmail == true) {
            this.pageState = SignInPageState.PasswordVerification; // Se o email existe, vai para a etapa de senha
          } else {
            this.pageState = SignInPageState.CreatingAccount; // Se o email não existe, oferece criar uma conta
          }
        },
        error(error) {
          this.pageState = SignInPageState.Error;
          // if (error.status != null) {
          //   // alert(this.translocoService.translate("componentsBase.requestError.error-401"))
          // }

        }
      });
    } catch (error) {
      this.pageState = SignInPageState.Error;
    }
  }

  async login() {
    try {
      this.isLoading = true;
      await this.authService.loginCredential(this.signInUserFormGroup.value.email,this.signInUserFormGroup.value.password, this.signInUserFormGroup.value.email);
      this.snackBar.open('Login bem-sucedido.', 'Fechar', {
        duration: 3000,
      });
    } catch (error) {
      this.isLoading = false;
      this.snackBar.open('Login ou senha incorretos.', 'Fechar', {
        duration: 3000,
      });
      this.pageState = SignInPageState.Error;
      console.error('Login ou senha incorretos', error);  
    } finally {
      this.router.navigate(['/']);
    }
  }

  logout() {
    // this.authService.logout();
  }

  createUser() {
    this.router.navigate(['createuser']);
  }

  resetPassword() {
    this.router.navigate(['resetPassword']);
  }

  goBackToLogin() {
    this.pageState = SignInPageState.EmailVerification;
  }

}
