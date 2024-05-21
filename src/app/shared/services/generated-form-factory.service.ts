import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { GeneratedSimpleFormComponent } from '../components/generated-simple-form/generated-simple-form.component';
import { GeneratedStepperFormComponent } from '../components/generated-stepper-form/generated-stepper-form.component';
import { FormGeneratorService } from './form-generator.service';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs';

/**
 * Interface com variáveis para criação dos formulários
 * @param target Referência ao local no html onde será criado o formulário
 * @param getDataFromAPIFunction Função para obter dados pela API
 * @param resourceForm FormGroup que armazenará dados do formulário
 * @param formOption Tipo de formulário, sendo ele por passo-a-passo ou comum
 * @param submitFormFunction Função para enviar dados do formulário para API
 * @param deleteFormFunction Função para enviar uma requisição de remoção dos dados para API
 * @param currentAction Situação atual do formulário, sendo de criação de um novo item ou alteração de um já existente
 * @param dataToCreatePage Dados que orientam na criação das paginas
 * @param secondaryFormClassName Em cada JSON que orienta a criação da página, se tem atributos da classe. Nesses atributos, se tem a propriedades, que são as variáveis de cada atributo. 
 * Esse campo é o no nome do atributo. [Exemplo]: A classe "Carro" tem o atributo "Fabricante" e fabricante tem as propriedades "nome", "país de operação". Nesse caso o "Fabricante" que será o valor dessa variável.
 */
interface ICreateFormParams {
  target: ViewContainerRef,
  getDataFromAPIFunction: () => void,
  resourceForm: FormGroup,
  formOption: string | null,
  submitFormFunction: () => void,
  deleteFormFunction: () => void,
  currentFormAction: string,
  dataToCreatePage: object,
  secondaryFormClassName?: string
}

interface IAttribute {
  name: string,
  type: string
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
  ) {}

  /**
   * Obtem dados base pra decidir qual tipo de formulário será criado
   * @param JSONDictionary 
   * @param target 
   * @param getDataFromAPIFunction 
   * @param resourceForm 
   * @param submitFormFunction 
   * @param deleteFormFunction 
   * @param currentFormAction 
   */
  getDataToCreateFrom(JSONDictionary: any, target: ViewContainerRef, getDataFromAPIFunction: () => void, resourceForm: FormGroup, submitFormFunction: () => void, deleteFormFunction: () => void, currentFormAction: string, secondaryFormClassName?: string) {

    const createFormParams: ICreateFormParams = {
      target: target,
      getDataFromAPIFunction: getDataFromAPIFunction,
      resourceForm: resourceForm,
      formOption: JSONDictionary.config.isFormStepper ? "stepperForm" : null,
      submitFormFunction: submitFormFunction,
      deleteFormFunction: deleteFormFunction,
      currentFormAction: currentFormAction,
      dataToCreatePage: JSONDictionary,
    }

    this.createForm(createFormParams);
  }

  /**
   * 
   * @param createFormParams Dados para criação dos formulários
   * @param secondaryFormClassName Formulário primário sé é o primeiro nível, dentro do JSON. Quando são as variáveis dentro de um atributo, é segundo nível de formulário, essa variável é o nome de qual atributo vai ser pego os dados
   */
  createForm(createFormParams: ICreateFormParams) {
    let createdComponent;
    const formStepperStructure = this.formGeneratorService.getFormStepperStructure(createFormParams.dataToCreatePage);

    if (createFormParams.formOption != null && formStepperStructure != null) {
      createdComponent = createFormParams.target.createComponent(GeneratedStepperFormComponent).instance;
      createdComponent.formStepperStructure = formStepperStructure;
    } else {
      createdComponent = createFormParams.target.createComponent(GeneratedSimpleFormComponent).instance;
    }


    let className;
    if (createFormParams.dataToCreatePage["config"].hasOwnProperty('name')) {
      className = createFormParams.dataToCreatePage["config"].name;
    }

    let attributes;
    //Obtem dados dos atributos que farão parte dos formulários
    if (createFormParams.secondaryFormClassName != null) {
      attributes = this.getSecondaryFormAttributesData(createFormParams.dataToCreatePage, createFormParams.secondaryFormClassName);
      className = createFormParams.secondaryFormClassName;
    } else {
      attributes = this.formGeneratorService.getAttributesData(createFormParams.dataToCreatePage);
    }

    createdComponent.resourceForm = createFormParams.resourceForm;
    createdComponent.submitFormFunction = createFormParams.submitFormFunction;
    createdComponent.deleteFormFunction = createFormParams.deleteFormFunction;
    createdComponent.formIsReady.pipe(take(1)).subscribe(() => { createFormParams.getDataFromAPIFunction() })//Quando o formulário é terminado de ser construido ele chama a função para obter os dados
    createdComponent.currentFormAction = createFormParams.currentFormAction;
    createdComponent.attributes = attributes;
    createdComponent.className = className;
    createdComponent.dataToCreatePage = createFormParams.dataToCreatePage;

  }

  getSecondaryFormAttributesData(JSONDictionary: object, className: string): IAttribute[] {
    if (!JSONDictionary["attributes"]) {
      return null;
    }
    
    let attributes : IAttribute[] = [];

    //Percorre todos os atributos da classe
    for (let attributeIndex = 0; attributeIndex < JSONDictionary["attributes"].length; attributeIndex++) {
      //Encontra o atributo que tem o mesmo nome da classe na qual o formulario pertence
      if (JSONDictionary["attributes"][attributeIndex]["name"] === className) {
        //Obtem todas as propriedades do atributo
        JSONDictionary["attributes"][attributeIndex]["properties"].forEach(element => {
          attributes.push({ name: element["name"], type: element["type"] });
        });

        return attributes;
      }

    }
    return attributes;

  }
}
