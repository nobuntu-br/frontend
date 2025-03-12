import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { take } from 'rxjs';
import { TenantService } from '../../tenant.service';
import { DatabaseCredential } from '../../databaseCredential/databaseCredential.model';
import { DatabaseCredentialService } from '../../databaseCredential/databaseCredential.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tenant-invite-user-form',
  templateUrl: './tenant-invite-user-form.component.html',
  styleUrls: ['./tenant-invite-user-form.component.scss']
})
export class TenantInviteUserFormComponent implements OnInit {

  databaseCredentials: DatabaseCredential[] = [];
  /**
   * Formulário para convidar o usuário a ter acesso a base de dados
   */
  inviteFormGroup: FormGroup = this._formBuilder.group({
    contact: ['', [Validators.required, Validators.pattern(
      /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,3}\)?[-.\s]?)?(\d{4,5}[-.\s]?\d{4})$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    ), Validators.minLength(8), Validators.maxLength(120)]],
    databaseCredentialId: ['', [Validators.required]],
  });
  /**
  * Variável de controle se está em carregamento a página
  */
  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private tenantService: TenantService,
    private databaseCredentialService: DatabaseCredentialService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {



  }

  getDatabaseCredentials() {

    let tenantId : number;
    //Pegar o ID do tenant da rota
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      tenantId = Number(params.get('id'));
    });

    this.databaseCredentialService.getByTenantId(tenantId).pipe(take(1)).subscribe({
      next: (databaseCredentials: DatabaseCredential[]) => {
        this.databaseCredentials = databaseCredentials;
      },
    })
  }

  async sendInvite() {
    console.log(this.inviteFormGroup.value);
    return null;

    if (this.inviteFormGroup.get("email").valid == false) {
      this.inviteFormGroup.markAsDirty();
      return;
    }

    this.isLoading = true;
    this.inviteFormGroup.get("email").disable();

    const invitedUserEmail: string = this.inviteFormGroup.value.email;
    //Pega os dados do localstorage
    let invitingUserEmail: string = this.authService.currentUser.email;
    //TODO mudar o tenant id para number
    let tenantId: number = Number(this.tenantService.currentTenant.tenant.id);
    let databaseCredentialId: number = Number(this.tenantService.currentTenant.databaseCredential.id);


    this.tenantService.inviteUserToTenant(invitingUserEmail, invitedUserEmail, tenantId, databaseCredentialId).pipe(take(1)).subscribe({
      next: (value) => {

        this.inviteFormGroup.get("email").enable();
        this.inviteFormGroup.get("email").setValue("");
        this.isLoading = false;

        this.snackBar.open("Usuário convidado. Foi enviado um email para o usuário.", "Fechar", {
          duration: 3000,
        }).afterDismissed().pipe(take(1)).subscribe({
          next: (value) => {

          }
        });
      },
      error: (error) => {
        console.log(error);

        this.inviteFormGroup.get("email").enable();
        this.isLoading = false;

        this.snackBar.open("Erro ao convidar usuário.", "Fechar", {
          duration: 3000,
        }).afterDismissed().pipe(take(1)).subscribe({
          next: (value) => {

          }
        });
      },
    });
  }

}
