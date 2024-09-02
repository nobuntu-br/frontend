import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationService } from 'app/shared/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  email: string = '';
  verificationCode: string = '';
  password: string = '';
  confirmPassword: string = '';
  
  codeSent: boolean = false;
  codeVerified: boolean = false;

  constructor(private http: HttpClient,
              private applicationService: ApplicationService,
              private snackBar: MatSnackBar,
              private router: Router) {}

  onEmailSubmit() {
    this.applicationService.sendVerificationCode(this.email)
      .subscribe(
        (response: any) => {
          console.log(response.message);
          this.codeSent = true;
        },
        (error) => {
          console.error('Erro ao enviar código:', error.error.message);
          this.snackBar.open('Erro ao enviar o código de verificação', 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar']
          });
        }
      );
  }

  onCodeSubmit() {
    this.applicationService.verifyCode(this.email, this.verificationCode)
      .subscribe(
        (response: any) => {
          console.log(response.message);
          this.codeVerified = true;
        },
        (error) => {
          console.error('Erro ao verificar código:', error.error.message);
          this.snackBar.open('Erro ao verificar o código', 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar']
          });
        }
      );
  }

  onResetSubmit() {
    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
      return;
    }

    const resetPasswordPayload = {
      email: this.email,
      password: this.password
    };

    // this.applicationService.resetPassword(resetPasswordPayload)
    //   .subscribe(
    //     (response: any) => {
    //       console.log('Password reset successfully!', response);
    //       this.snackBar.open('Senha redefinida com sucesso!', 'Close', {
    //         duration: 3000,
    //       });
    //       this.router.navigate(['login']); // Redireciona para a tela de login
    //     },
    //     (error) => {
    //       console.error('Erro ao redefinir senha!', error);
    //       this.snackBar.open('Erro ao redefinir a senha', 'Close', {
    //         duration: 3000,
    //       });
    //     }
    //   );
  }
}
