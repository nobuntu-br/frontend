import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TenantCredentialService } from '../tenantCredential.service';
import { finalize, take, tap } from 'rxjs';
import { ITenantCredential } from '../tenantCredential.model';
import { ITenant, Tenant } from '../tenant.model';
import { TenantService } from '../tenant.service';
import { AuthService } from 'app/core/auth/auth.service';

interface DataBaseType {
  name: string;
}

export enum AddTenantStep {
  setOptionAddTenantStep = "setOptionAddTenantStep",
  accessTenantWithCodeStep = "accessTenantWithCodeStep",
  createNewTenantCredentialStep = "createNewTenantCredentialStep",
  createNewTenantStep = "createNewTenantStep",
  selectTenantToCreateTenantCredentialStep = "selectTenantToCreateTenantCredentialStep"
}

enum AddTenantResponse {
  success = "success",
  failure = "failure"
}

@Component({
  selector: 'app-tenant-crendential-form',
  templateUrl: './tenant-credential-form.component.html',
  styleUrls: ['./tenant-credential-form.component.scss']
})
export class TenantCredentialFormComponent  implements OnInit {

  currentPageStep: AddTenantStep = AddTenantStep.setOptionAddTenantStep;
  addTenantResponse: AddTenantResponse = AddTenantResponse.failure;

  isRegisterTenantLoading: boolean = false;

  databaseTypes: DataBaseType[] = [
    { name: "mongodb" },
    { name: "postgres" }
  ];

  /**
   * Opção que será feita para adicionar novo tenant
   */
  addTenantOptionFormGroup: FormGroup = this._formBuilder.group({
    addTenantOptionControl: ['', Validators.required],
  });

  /**
   * Formulário para registro de novo tenant
   */
  registerNewTenantFormGroup: FormGroup = this._formBuilder.group({
    dbName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    dbType: ['', [Validators.required]],
    dbUsername: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    dbPassword: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    dbHost: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    dbPort: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$')]],
  });

  createNewTenantFormGroup: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
  });

  selectTenantToCreateTenantCredentialFormGroup: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
  });

  importNewTenantFormGroup: FormGroup = this._formBuilder.group({
    codeValue: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
  })

  tenantsUserIsAdmin: ITenant[];

  constructor(
    private dialogRef: MatDialogRef<TenantCredentialFormComponent>,
    private _formBuilder: FormBuilder,
    private tenantCredentialsService: TenantCredentialService,
    private tenantService: TenantService,
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    this.loadTenantsUserIsAdmin(this.authService.currentUser.UID);
  }

  selectAddTenantOption() {
    if (!this.addTenantOptionFormGroup.valid) {
      return null;
    }

    switch (this.addTenantOptionFormGroup.get("addTenantOptionControl").value) {
      case "accessTenantWithCodeStep":
        this.currentPageStep = AddTenantStep.accessTenantWithCodeStep;
        break;
      case "createNewTenantCredentialStep":
        this.currentPageStep = AddTenantStep.createNewTenantCredentialStep;
        break;
      default:
        this.currentPageStep = AddTenantStep.accessTenantWithCodeStep;
        break;
    }
  }

  cancel(): void {
    // this.tenantOptionCardEnabled = true;
    this.currentPageStep = AddTenantStep.setOptionAddTenantStep;
  }

  registerNewTenant() {

    this.isRegisterTenantLoading = true;

    if (this.registerNewTenantFormGroup.valid != true) {
      console.warn("Erro ao registrar o tenant, valores inválidos");
      return Error("Erro ao registrar o tenant");
    }


    //TODO ao tentar realizar o registro, deverá ser feito o teste de conectividade, posteiriormente retornado a resposta para cá
    this.tenantCredentialsService.create(
      {
        dbName: this.registerNewTenantFormGroup.get('dbName').value,
        dbType: this.registerNewTenantFormGroup.get('dbType').value,
        dbUsername: this.registerNewTenantFormGroup.get('dbUsername').value,
        dbPassword: this.registerNewTenantFormGroup.get('dbPassword').value,
        dbHost: this.registerNewTenantFormGroup.get('dbHost').value,
        dbPort: this.registerNewTenantFormGroup.get('dbPort').value,
      }
    ).pipe(
      //Depos de recebido dados 1 vez o observable é encerrado
      take(1),
    ).subscribe({
      next: (value) => {
        this.isRegisterTenantLoading = false;

        console.log(value);

        //TODO irá apresentar a mensagem que deu certo
        //TODO irá recarregar a pagina do usuário, adicionando o tenant ao controle de tenants para ser usado o ID no HTTP interceptor

      },
      error: (error) => {
        console.log(error);
        this.isRegisterTenantLoading = false;
        //TODO irá apresentar a mensagem de erro ao não ter conseguido adicionar o tenant, seja por erro ao salvar ou ao tentar conectar com o tenant
      },
    })
  }

  loadTenantsUserIsAdmin(userUID: string): void {
    this.tenantService.getTenantsUserIsAdmin(userUID).pipe(take(1)).subscribe({
      next: (_tenantsUserIsAdmin : Tenant[]) => {
        this.tenantsUserIsAdmin = _tenantsUserIsAdmin;
      },
      error: (error) => {

      },
    });
  }
}
