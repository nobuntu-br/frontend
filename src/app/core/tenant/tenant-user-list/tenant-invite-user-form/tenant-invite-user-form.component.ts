import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  ) {

  }

  sendInvite() {
    if (this.emailFormGroup.get("email").valid == false) {
      this.emailFormGroup.markAsDirty();
      return;
    }
    const email: string = this.emailFormGroup.value.email;

    this.emailFormGroup.get("email").disable();
    this.isLoading = true;

    //TODO chamar a função que irá chamar a rota de convidar o usuário
    /*
    this.userService.checkEmailExist(email).pipe(
      take(1),

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

        this.snackBar.open(checkEmailErrorMessage, 'Fechar', {
          duration: 3000,
        });
      }
    });
    */
  }
    
}
