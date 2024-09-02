import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationService } from 'app/shared/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user = {
    userId: '',
    displayName: '',
    givenName: '',
    surname: ''
  };

  constructor(
    private http: HttpClient,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const profile = currentUser.profile || {};

    this.user = {
      userId: profile.sub || '',
      displayName: profile.name || '',
      givenName: profile.given_name || '',
      surname: profile.family_name || ''
    };
  }

  onSubmit() {
    this.applicationService.updateUserProfile(this.user)
      .subscribe(
        (response: any) => {
          console.log('Profile updated successfully!', response);
          this.snackBar.open('Perfil atualizado com sucesso!', 'Close', {
            duration: 3000,
          });
          // Atualizar o profile no currentUser no localStorage
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          currentUser.profile = {
            ...currentUser.profile,
            name: this.user.displayName,
            given_name: this.user.givenName,
            family_name: this.user.surname,
          };
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.router.navigate(['/']); // Navegar de volta ao perfil ou outra página
        },
        (error) => {
          console.error('Erro ao atualizar perfil!', error);
          this.snackBar.open('Erro ao atualizar o perfil', 'Close', {
            duration: 3000,
          });
        }
      );
  }
}
