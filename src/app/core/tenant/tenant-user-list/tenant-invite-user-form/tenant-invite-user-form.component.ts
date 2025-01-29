import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-tenant-invite-user-form',
  templateUrl: './tenant-invite-user-form.component.html',
  styleUrls: ['./tenant-invite-user-form.component.scss']
})
export class TenantInviteUserFormComponent {

  emailFormGroup: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(120)]],
  });
  /**
  * Variável de controle se está em carregamento a página
  */
  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {

  }

  async sendInvite() {
    if (this.emailFormGroup.get("email").valid == false) {
      this.emailFormGroup.markAsDirty();
      return;
    }
    const email: string = this.emailFormGroup.value.email;

    this.emailFormGroup.get("email").disable();
    this.isLoading = true;

    this.authService.checkEmailExist(email).pipe(take(1)).subscribe({
      next: (value) => {

        //TODO traduzir com o transloco essas mensagens
        this.snackBar.open("Usuário convidado com sucesso!", "Fechar", {
          duration: 3000,
        });
        
      },
      error: (error) => {

        //TODO traduzir com o transloco essas mensagens
        this.snackBar.open("Erro ao convidaro usuário. Email inválido!", "Fechar", {
          duration: 3000,
        });

      },
    });

    this.emailFormGroup.get("email").enable();
    this.isLoading = false;
  }

}
