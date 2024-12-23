import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatabaseCredentialService } from '../databaseCredential.service';
import { take } from 'rxjs';
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
  selector: 'database-crendential-form',
  templateUrl: './database-credential-form.component.html',
  styleUrls: ['./database-credential-form.component.scss']
})
export class DatabaseCredentialFormComponent  implements OnInit {

  currentPageStep: AddTenantStep = AddTenantStep.createNewTenantStep;
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
    databaseName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    databaseType: ['', [Validators.required]],
    databaseUsername: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    databasePassword: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    databaseHost: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    databasePort: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$')]],
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
    private _formBuilder: FormBuilder,
    private databaseCredentialService: DatabaseCredentialService,
    private tenantService: TenantService,
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    // this.loadTenantsUserIsAdmin(this.authService.currentUserSession.user.UID);
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

    if (this.registerNewTenantFormGroup.valid == false) {
      console.warn("Erro ao registrar o tenant, valores inválidos");
      return Error("Erro ao registrar o tenant");
    }


    //TODO ao tentar realizar o registro, deverá ser feito o teste de conectividade, posteiriormente retornado a resposta para cá
    this.databaseCredentialService.create(
      {
        databaseName: this.registerNewTenantFormGroup.get('databaseName').value,
        databaseType: this.registerNewTenantFormGroup.get('databaseType').value,
        databaseUsername: this.registerNewTenantFormGroup.get('databaseUsername').value,
        databasePassword: this.registerNewTenantFormGroup.get('databasePassword').value,
        databaseHost: this.registerNewTenantFormGroup.get('databaseHost').value,
        databasePort: this.registerNewTenantFormGroup.get('databasePort').value,
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
