import { AfterContentInit, AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Optional, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { IPageStructure } from 'app/shared/models/pageStructure';
import { FormGeneratorService, ICreateComponentParams } from 'app/shared/services/form-generator.service';
import { GeneratedSimpleFormComponent } from '../generated-simple-form/generated-simple-form.component';
import { FormSpaceBuildService } from 'app/shared/services/form-space-build.service';

export interface ICreateSpace{
      resourceForm: any,
      className: string,
      target: any,
      value: IPageStructure,
      dataToCreatePage: IPageStructure
}

export interface ICreateSpaceStepper{
  name: string,
  component: ICreateSpace
}

@Component({
  selector: 'app-form-space-build',
  templateUrl: './form-space-build.component.html',
  styleUrls: ['./form-space-build.component.scss']
})
export class FormSpaceBuildComponent implements AfterViewInit {
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
   * Dados contidos no JSON que orienta a criação da página
   */
  @Input() dataToCreatePage: IPageStructure;
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
   * Informa quais são os passos e nome de cada passo do formulário.
   * @example "['endereco', 'valores', 'forma de pagamento']"
   */
    formStepperStructure : ICreateSpaceStepper[] = [];

  /**
   * No JSON que orienta a criação de paginas, cada um JSON é uma classe, nessa classe se tem cada variável com suas informações.
   */
  // @Input() attributes: IAttributesToCreateScreens[];
  /**
   * Nome da classe na qual o formulário pertence.
   * @example "Produtos"
   */
  @Input() className: string;
  /**
   * Configurações adicionais (ainda não é usado)
   */
  @Input() config;

  dataToCreatePageSteps: IPageStructure[] = [];

  isLoading: boolean = true;

  @ViewChildren('placeToRender', { read: ViewContainerRef }) target!: QueryList<ViewContainerRef>;

  constructor(
    public formSpaceBuild: FormSpaceBuildService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Optional() private matDialogComponentRef: MatDialogRef<GeneratedSimpleFormComponent>
    ) { }

  ngAfterViewInit(): void {
    this.checkTypeOfForm();
  }

  checkTypeOfForm() {
    if(this.dataToCreatePage.config.isFormStepper && this.checkIfHasSubForm()){
      console.log("SubForm Stepper");
      // this.generateStepSubForm();
      // this.generateStepFormList();
      // this.generateSubFormList();
      return;
    }
    if(this.checkIfHasSubForm()){
      console.log("SubForm");
      this.generateSubFormList();
    }
    if(this.dataToCreatePage.config.isFormStepper){
      console.log("Stepper");
      this.generateStepFormList();
    }
    if(!this.dataToCreatePage.config.isFormStepper && !this.checkIfHasSubForm()){
      console.log("SimpleForm");
      this.generateSimpleFormList();
    }
  }

  /**
   * Função que irá criar cada campo de preenchimento de acordo com as variáveis da classe do formulário.
   */
  generateSimpleFormList() {

    let send: ICreateSpace = {
      resourceForm: this.resourceForm,
      className: this.className,
      target: this.target.toArray()[0],
      value: this.dataToCreatePage,
      dataToCreatePage: this.dataToCreatePage
    }

    let simpleForm = this.formSpaceBuild.createComponent(send);
  }

  generateStepSubForm() {
    this.formStepperStructure = [];
    this.buildStepperStructure();
    // this.buildDataToCreatePageStepsSubForm();
    this.buildDataToCreatePageSteps()
    setTimeout(() => {
      this.dataToCreatePageSteps.forEach((data, index) => {
          
        let send: ICreateSpace = {
          resourceForm: this.resourceForm,
          className: this.className,
          target:this.target.toArray()[index],
          value: data,
          dataToCreatePage: data
        }
        
        let simpleForm = this.formSpaceBuild.createComponent(send);
        });
      });
      
      this.formIsReady.emit(true);
  }

  generateStepFormList() {
    this.formStepperStructure = [];
    this.buildStepperStructure();
    this.buildDataToCreatePageSteps();
    setTimeout(() => {
      this.dataToCreatePageSteps.forEach((data, index) => {
          
        let send: ICreateSpace = {
          resourceForm: this.resourceForm,
          className: this.className,
          target:this.target.toArray()[index],
          value: data,
          dataToCreatePage: data
        }
        
        let simpleForm = this.formSpaceBuild.createComponent(send);
        });
      });
      
      this.formIsReady.emit(true);
  }

  buildDataToCreatePageSteps(){
    this.dataToCreatePage.config.steps.forEach((step, index) => {
      this.dataToCreatePageSteps.push({config: this.dataToCreatePage.config, attributes: this.dataToCreatePage.attributes.filter(attribute => attribute.step === step)});
    });
  }

  buildStepperStructure(){
    this.dataToCreatePage.config.steps.forEach(step => {
      this.formStepperStructure.push({name: step, component: {resourceForm: this.resourceForm, className: this.className, target: this.target, value: this.dataToCreatePage, dataToCreatePage: this.dataToCreatePage}});
    });
  }

  buildDataToCreatePageSubForm(){
    if(this.dataToCreatePageSteps.length === 0){
      this.dataToCreatePageSteps.push({config: this.dataToCreatePage.config, attributes: this.dataToCreatePage.attributes.filter(attribute => attribute.type !== "subform")});
    }

    let dataToCreatePageWithSubForm = this.dataToCreatePage;
    dataToCreatePageWithSubForm.attributes = this.dataToCreatePage.attributes.filter(attribute => attribute.type === "subform");

    dataToCreatePageWithSubForm.attributes.forEach((attribute, index) => {
      this.dataToCreatePageSteps.push({config: this.dataToCreatePage.config, attributes: [attribute]});
    });

  }

  buildDataToCreatePageStepsSubForm(){
    this.dataToCreatePageSteps.forEach((step, index) => {
      this.dataToCreatePageSteps[index].attributes = this.dataToCreatePageSteps[index].attributes.filter(attribute => attribute.type !== "subform");
    });

    // let dataToCreatePageWithSubForm = this.dataToCreatePage;
    // dataToCreatePageWithSubForm.attributes = this.dataToCreatePage.attributes.filter(attribute => attribute.type === "subform");

    // dataToCreatePageWithSubForm.attributes.forEach((attribute, index) => {
    //   this.dataToCreatePageSteps.push({config: this.dataToCreatePage.config, attributes: [attribute]});
    // });
  }

  generateSubFormList() {
    console.log("SubForm");
    this.buildDataToCreatePageSubForm();
    setTimeout(() => {

      this.dataToCreatePageSteps.forEach((data, index) => {
          
        let send: ICreateSpace = {
          resourceForm: this.resourceForm,
          className: this.className,
          target:this.target.toArray()[index],
          value: data,
          dataToCreatePage: data
        }
    
        let simpleForm = this.formSpaceBuild.createComponent(send);
        });
      });
      console.log("SubForm: ", this.formStepperStructure);
      this.formIsReady.emit(true);
  }

  buildResourceForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      id: [null],
    });
  }

  SeeFormData() {
    console.log(this.resourceForm.value)
  }

  /**
   * Caso esse formuário for aberto como dialog, ele fechará. Se não ele irá para pagina anterior.
   */
  return() {
    if (this.matDialogComponentRef) {
      
      this.matDialogComponentRef.close();

    } else {
      if(this.currentFormAction === "edit"){
        this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
      } else if(this.currentFormAction === "new"){
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      }
    }
  }

  checkIfHasSubForm(): boolean {
    let hasSubForm: boolean = false;
    this.dataToCreatePage.attributes.forEach((attribute, index) => {
      if(attribute.type === "subform"){
        this.formStepperStructure.push({name: attribute.name, component: {resourceForm: this.resourceForm, className: this.className, target: this.target, value: this.dataToCreatePage, dataToCreatePage: this.dataToCreatePage}});
        hasSubForm = true;
      }
    });
    return hasSubForm;
  }

  isLastStep(stepper: MatStepper): boolean {
    return stepper.selectedIndex === stepper.steps.length - 1;
  }

  isFirstStep(stepper: MatStepper): boolean {
    return stepper.selectedIndex === 0;
  }

  // alertToReturn(){
  //   if(this.formSaved == true) return;

  //   alert(this.translocoService.translate("Alerts.rememberToSave"));
  // }


}
