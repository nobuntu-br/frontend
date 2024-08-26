import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationService } from 'app/shared/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  user = {
    username: '',
    displayName: '',
    surname: '',
    givenName: '',
    password: '',
    confirmPassword: ''
  };
  domain: string = '';

  constructor(private http: HttpClient,
    private applicationService: ApplicationService,
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
  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
      return;
    }

    const email = `${this.user.username}${this.domain}`;
    const createUserPayload = {
      displayName: this.user.displayName,
      mailNickname: this.user.username,
      surname: this.user.surname,
      givenName: this.user.givenName,
      userPrincipalName: email,
      password: this.user.password
    };

    // console.log(createUserPayload);
    this.applicationService.createUser(createUserPayload).subscribe(
      async response => {
        console.log('User created successfully!', response);
        await this.authService.loginCredential(response.user.userPrincipalName, this.user.password);
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
