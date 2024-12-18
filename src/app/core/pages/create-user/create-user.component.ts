import { Component } from '@angular/core';
import { ApplicationService } from 'app/shared/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'app/core/auth/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  user = {
    email: '',
    displayName: '',
    surname: '',
    givenName: '',
    password: '',
    confirmPassword: ''
  };
  domain: string = '';
  verificationSent: boolean = false;
  emailValidated: boolean = false; // Para verificar se o email foi validado

  emailExists: boolean = false;


  //novos

  email: string = '';
  verificationCode: string = '';
  fullName: string = '';
  password: string = '';
  
  codeSent: boolean = false;
  codeVerified: boolean = false;
  constructor(
    private applicationService: ApplicationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.applicationService.getDomain().subscribe(
      domain => {
        this.domain = '@'+domain;
        console.log('Domain obtained:', this.domain);
      },
      error => {
        console.error('Error fetching domain', error);
      }
    );
  }
  onEmailSubmit() {
    this.snackBar.dismiss(); // Limpa qualquer mensagem anterior
    this.userService.sendVerificationEmailCodeToEmail(this.email)
    // this.applicationService.sendVerificationCode(this.email)
      .subscribe(
        (response: any) => {
          console.log(response.message);
          this.codeSent = true;
          this.snackBar.open('Código de verificação enviado com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Erro ao enviar código:', error.error.message);
          this.snackBar.open('Erro ao enviar código. Por favor, tente novamente.', 'Fechar', {
            duration: 3000,
          });
        }
      );
  }

  onCodeSubmit() {
    this.snackBar.dismiss(); // Limpa qualquer mensagem anterior
    this.userService.verifyCodeSentToEmail(this.email, this.verificationCode)
      .subscribe(
        (response: any) => {
          console.log(response.message);
          this.codeVerified = true;
          this.snackBar.open('Código verificado com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Erro ao verificar código:', error.error.message);
          this.snackBar.open('Erro ao verificar código. Por favor, tente novamente.', 'Fechar', {
            duration: 3000,
          });
        }
      );
  }
  onRegisterSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (this.emailExists) {
      this.snackBar.open('Please use a different email address.', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
      return;
    }

    const emailParts = this.email.split('@');
    if (emailParts.length !== 2) {
      this.snackBar.open('Invalid email format!', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
      return;
    }

    const emailDomain = `${this.email.replace('@', '_')}#EXT#${this.domain}`;

    const createUserPayload = {
      displayName: this.user.displayName,
      mailNickname: `${this.email.replace('@', '_')}#EXT#`,
      surname: this.user.surname,
      givenName: this.user.givenName,
      userPrincipalName: emailDomain,
      password: this.user.password,
      email: this.email
    };

    console.log(createUserPayload);
    this.applicationService.createUser(createUserPayload).subscribe(
      async response => {
        console.log('User created successfully!', response);
        await this.authService.loginCredential(response.user.userPrincipalName, this.user.password, this.email);
        this.snackBar.open('User created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['']);
      },
      error => {
        console.log('Error creating user!', error);

        this.snackBar.open('Error creating user', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
