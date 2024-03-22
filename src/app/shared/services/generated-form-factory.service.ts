import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { GeneratedSimpleFormComponent } from '../components/generated-simple-form/generated-simple-form.component';
import { GeneratedStepperFormComponent } from '../components/generated-stepper-form/generated-stepper-form.component';
import { FormGeneratorService } from './form-generator.service';
import { FormGroup } from '@angular/forms';

/**
   * Parâmetros usados para criação do formulário
   * @param target referência da view para onde será criado e renderizado os componentes.
   * @param getDataFromAPIFunction função que pegará os dados do backEnd dos dados pertencentes a classe do formulário.
   * @param resourceForm formGroup do formulário que contém todos os campos do formulário.
   * @param formOption opção do formulário que será utilizado para a pagina. Contendo formuário simples, por passos e outros.
   * @param attributes informações relacionadas a todas as variáveis que irão gerar os campos do formulário.
   * @param className nome da classe que o formulário pertence
   * @param submitFormFunction função que realiza o envio dos dados do formuário para o backEnd.
   * @param deleteFormFunction função que deleta a instância da classe do formulário.
   * @param currentFormAction situação atual do formulário, sendo "create" para criação ou "edit" para edição de algum valor.
   * @param JSONPath string que contém o caminho do arquivo JSON que orienta a criação das paginas
   * @param formStepperStructure array contendo os nomes de cada passo do formuário de passos.
   */
interface ICreateFormParams {
  target: ViewContainerRef,
  getDataFromAPIFunction: () => void,
  resourceForm: FormGroup,
  formOption: string | null,
  attributes,
  className,
  submitFormFunction: () => void,
  deleteFormFunction: () => void,
  currentFormAction: string,
  JSONPath: string,
  formStepperStructure?: string[] | null,
}

/**
 * Classe responsável por direcionar para qual tipo de componente de formulário será gerado.
 */
@Injectable({
  providedIn: 'root'
})
export class GeneratedFormFactoryService {

  constructor(
    private formGeneratorService: FormGeneratorService,
  ) {

  }

  /**
   * Obtem dados para posteriormente criar o formulário requisitado.
   * @param JSONDictionary Dados do arquivo JSON usado para gerar os componentes.
   * @param target referência da view para onde será criado e renderizado os componentes.
   * @param getDataFromAPIFunction função que pegará os dados do backEnd dos dados pertencentes a classe do formulário.
   * @param resourceForm formGroup do formulário que contém todos os campos do formulário.
   * @param submitFormFunction função que realiza o envio dos dados do formuário para o backEnd.
   * @param deleteFormFunction função que deleta a instância da classe do formulário.
   * @param currentFormAction situação atual do formulário, sendo "create" para criação ou "edit" para edição de algum valor.
   */
  getDataToCreateForm(JSONPath: string, JSONDictionary: any, target: ViewContainerRef, getDataFromAPIFunction: () => void, resourceForm: FormGroup, submitFormFunction: () => void, deleteFormFunction: () => void, currentFormAction: string) {

    let formOption: string;
    let className: string;

    if (JSONDictionary.config.isFormStepper) {
      formOption = "stepperForm";
    }
    if (JSONDictionary.config.hasOwnProperty('name')) {
      className = JSONDictionary.config.name;
    }

    const attributes = this.formGeneratorService.getAttributesData(JSONDictionary);
    const formStepperStructure = this.formGeneratorService.getFormStepperStructure(JSONDictionary);

    const createFormParams : ICreateFormParams = {
      target: target,
      getDataFromAPIFunction: getDataFromAPIFunction,
      resourceForm: resourceForm,
      formOption: formOption,
      attributes: attributes,
      className: className,
      submitFormFunction: submitFormFunction,
      deleteFormFunction: deleteFormFunction,
      currentFormAction: currentFormAction,
      JSONPath: JSONPath,
      formStepperStructure: formStepperStructure
    } 

    this.createForm(createFormParams);
  }

  /**
   * 
   * @param JSONPath localização de onde se encontra o JSON que orienta na criação das paginas.
   * @param className Nome da classe no qual pertence esse formuário.
   * @example "Products"
   * @param JSONDictionary Dados do arquivo JSON usado para gerar os componentes.
   * @param target referência da view para onde será criado e renderizado os componentes.
   * @param getDataFromAPIFunction função que pegará os dados do backEnd dos dados pertencentes a classe do formulário.
   * @param resourceForm formGroup do formulário que contém todos os campos do formulário.
   * @param submitFormFunction função que realiza o envio dos dados do formuário para o backEnd.
   * @param deleteFormFunction função que deleta a instância da classe do formulário.
   * @param currentFormAction situação atual do formulário, sendo "create" para criação ou "edit" para edição de algum valor.
   * @returns 
   */
  getDataToCreateFormWithoutJSON(JSONPath: string, JSONDictionary: any, className: string, target: ViewContainerRef, getDataFromAPIFunction: () => void, resourceForm: FormGroup, submitFormFunction: () => void, deleteFormFunction: () => void, currentFormAction: string) {

    //Entra no attributes e percorre até achar o className e de lá pega tudo que for necessário

    if (!JSONDictionary.attributes) {
      return null;
    }

    let attributes = [];

    for (let attributeIndex = 0; attributeIndex < JSONDictionary.attributes.length; attributeIndex++) {
      if (JSONDictionary.attributes[attributeIndex].name === className) {
        JSONDictionary.attributes[attributeIndex].properties.forEach(element => {
          attributes.push({ name: element.name, type: element.type });
        });
        break;
      }

    }

    const createFormParams : ICreateFormParams = {
      target: target,
      getDataFromAPIFunction: getDataFromAPIFunction,
      resourceForm: resourceForm,
      formOption: null,
      attributes: attributes,
      className: className,
      submitFormFunction: submitFormFunction,
      deleteFormFunction: deleteFormFunction,
      currentFormAction: currentFormAction,
      JSONPath: JSONPath,
      formStepperStructure: null
    } 

    this.createForm(createFormParams);
  }


  /**
   * Um factory que de acordo com a parâmetro "formOption" irá criar o formulário de modelo diferente de acordo com o valor passado.
   * @param createFormParams Parâmetros usados para criar o formulário
   */
  createForm(
    createFormParams: ICreateFormParams
  ) {
    let createdComponent;

    switch (createFormParams.formOption) {
      case 'stepperForm':
        if (createFormParams.formStepperStructure != null) {
          createdComponent = createFormParams.target.createComponent(GeneratedStepperFormComponent).instance;
          createdComponent.formStepperStructure = createFormParams.formStepperStructure;
        } else {
          createdComponent = createFormParams.target.createComponent(GeneratedSimpleFormComponent).instance;
        }
        break;
      default:
        createdComponent = createFormParams.target.createComponent(GeneratedSimpleFormComponent).instance;
        break;
    }

    createdComponent.resourceForm = createFormParams.resourceForm;
    createdComponent.attributes = createFormParams.attributes;
    createdComponent.submitFormFunction = createFormParams.submitFormFunction;
    createdComponent.formIsReady.subscribe(() => { createFormParams.getDataFromAPIFunction() })
    createdComponent.deleteFormFunction = createFormParams.deleteFormFunction;
    createdComponent.currentFormAction = createFormParams.currentFormAction;
    createdComponent.className = createFormParams.className;
    createdComponent.JSONPath = createFormParams.JSONPath;
  }
}
