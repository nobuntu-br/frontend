import { AfterViewInit, Component, EventEmitter, Input, Optional, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGeneratorService, IAttributes } from 'app/shared/services/form-generator.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'generated-simple-form',
  templateUrl: './generated-simple-form.component.html',
  styleUrls: ['./generated-simple-form.component.scss']
})
export class GeneratedSimpleFormComponent implements AfterViewInit {

  /**
   * FormGroup que armazena os dados do formuário. Todas os dados vão diretamente para ele, para assim ir para as APIs.
   */
  @Input() resourceForm: FormGroup;
  /**
   * Output que indica quando o formulário terminou de ser criado.
   * Exemplo: false.
   */
  @Output() formIsReady = new EventEmitter<boolean>();
  // resourceForm: FormGroup;
  /**
   * Formulário usará o localStorage para armazenar valores que estão sendo preenchidos.
   * @example true
   */
  @Input() storeInLocalStorage: boolean = true;
  /**
   * Localizade onde o JSON que orienta a criação das paginas se encontra.
   * @example "../../../../assets/dicionario/classe.json"
   */
  @Input() JSONPath: string;
  /**
   * Função que informa e envia para API os dados para criação ou edição do item.
   */
  @Input() submitFormFunction: () => void;
  /**
   * Função que informa para API remover o item está sendo editando. 
   */
  @Input() deleteFormFunction: () => void;
  /**
   * Função responsável para retornar a pagina anterior
   */
  @Input() returnFormFunction: () => void;
  /**
   * Situação atual do formuário, sendo ele estando no modo de edita ou criar um novo item.
   * @example "edit" ou "new"
   */
  @Input() currentFormAction: string;

  /**
   * No JSON que orienta a criação de paginas, cada um JSON é uma classe, nessa classe se tem cada variável com suas informações.
   */
  @Input() attributes: IAttributes[];
  /**
   * Nome da classe na qual o formulário pertence.
   * @example "Produtos"
   */
  @Input() className: string;
  /**
   * Configurações adicionais (ainda não é usado)
   */
  @Input() config;

  @ViewChild('placeToRender', { read: ViewContainerRef }) target!: ViewContainerRef;

  constructor(
    private matDialog: MatDialog,
    public formGenerator: FormGeneratorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Optional() private matDialogComponentRef: MatDialogRef<GeneratedSimpleFormComponent>
  ) { }

  ngAfterViewInit(): void {
    this.generateSimpleFormList();
  }

  /**
   * Função que irá criar cada campo de preenchimento de acordo com as variáveis da classe do formulário.
   */
  generateSimpleFormList() {
    setTimeout(() => {
      this.attributes.forEach((attribute) => {
        this.formGenerator.createComponent(
          this.target,
          this.resourceForm,
          this.matDialog,
          this.className,
          attribute.name,
          attribute.type,
          { propertiesAttributes: attribute.propertiesAttributes, apiUrl: attribute.apiUrl },
          attribute.name,
          this.JSONPath,
          null
        )
      });
      this.formIsReady.emit(true);
    }, 0);
  }

  buildResourceForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      id: [null],
    });
  }

  SeeFormData() {
    console.log(this.resourceForm.value)
  }

  return() {
    if (this.matDialogComponentRef) {
      this.matDialogComponentRef.close();
    } else {
      this.router.navigate(['../../'], {relativeTo: this.activatedRoute});

      // this.returnFormFunction();
    }
  }

  // alertToReturn(){
  //   if(this.formSaved == true) return;

  //   alert(this.translocoService.translate("Alerts.rememberToSave"));
  // }

}
