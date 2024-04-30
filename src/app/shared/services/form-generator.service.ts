import { ComponentType } from '@angular/cdk/portal';
import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InputDateFieldComponent } from '../components/input-date-field/input-date-field.component';
import { InputFieldComponent } from '../components/input-field/input-field.component';
import { SelectorInputFieldComponent } from '../components/selector-input-field/selector-input-field.component';
import { ForeignKeyInputFieldComponent } from '../components/foreign-key-input-field/foreign-key-input-field.component';
import { DefaultListComponent } from '../components/default-list/default-list.component';
import { CalculatorComponent } from '../components/calculator/calculator.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SubformComponent } from '../components/subform/subform.component';

interface dialogConfiguration {
  width?: string,
  height?: string,
  maxWidth?: string,
  maxHeight?: string,
  panelClass?: string,
  data?: any,
}

/**
 * Atributos principais de variável da classe do JSON que informa como criar as telas
 * @param JSONDictionary JSON que informa como criar as telas
 * @param name - nome da variável.
 * @param type - tipo da variável.
 * @param formTab - informação de para qual aba do formTab essa variável pertence.
 * @param apiUrl link para chamar a classe dessa variável.
 * @param propertiesAttributes Se a variável for uma classe, retorná um vetor com variavel com nome e tipo das variáveis que contém na classe).
 * @param fieldDisplayedInLabel Nome da variável que será apresentado na label
 */
export interface IAttributesToCreateScreens {
  name: string,
  type: string,
  formTab: string,
  apiUrl?: string,
  propertiesAttributes?: any[],
  fieldDisplayedInLabel: string
}

/**
  * Dados que irão criar um campo que irá compor o formulário
  * @param target referência da view para onde será criado e renderizado os componentes
  * @param resourceForm formGroup do formulário que contém todos os campos do formulário
  * @param className Nome da classe no qual pertence esse formuário
  * @param fieldName Nome da variável na qual o campo é. @example "phone"
  * @param fieldType Tipo da variável do campo. @examples "number", "foreignKey"
  * @param value Contém vários valores dentro @example "apiUrl"; "fieldName" e "fieldsType" caso tem chave estrangeira;
  * @param labelTittle Título que aparecerá no topo do campo @example "Telefone"
  * @param dataToCreatePage Dados sobre como deve ser a criação das telas
  * @param fieldDisplayedInLabel Campo que será apresentado na label (titulo) do componente
  * @param valuesList
  */
export interface ICreateComponentParams {
  target: ViewContainerRef,
  resourceForm: FormGroup,
  className: string,
  fieldName: string,
  fieldType: string,
  value,
  labelTittle: string,
  dataToCreatePage: object,
  fieldDisplayedInLabel: string,
  valuesList: any[]
}

/**
 * Classe responsável pela geração dos componentes presentes nos formulários.
 */
@Injectable({
  providedIn: 'root'
})
export class FormGeneratorService {

  protected httpClient: HttpClient;
  protected formBuilder: FormBuilder;
  protected matDialog: MatDialog;

  constructor(protected injector: Injector) {
    this.httpClient = injector.get(HttpClient);
    this.formBuilder = injector.get(FormBuilder);
    this.matDialog = injector.get(MatDialog);
  }

  buildResourceForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      id: [null],
    });
  }

  //TODO remover código repetitivo
  createComponent(
    createComponentData: ICreateComponentParams
  ) {

    if (createComponentData.target == null) {
      console.error("Target vazia, não é possível criar a pagina");
      return null;
    }

    let createdComponent;
    switch (createComponentData.fieldType) {
      case 'date': {
        createdComponent = createComponentData.target.createComponent(InputDateFieldComponent);
        createdComponent.instance.label = createComponentData.labelTittle;

        break;
      }
      case 'string': {
        createdComponent = createComponentData.target.createComponent(InputFieldComponent);
        createdComponent.instance.label = createComponentData.labelTittle;
        createdComponent.instance.isRequired = true;

        // createdComponent.instance.svgIcon = "heroicons_solid:user";
        //createdComponent.instance.actionOnClickInIcon = ()=>{console.log("Você apertou no icone")}

        break;
      }
      case 'object': {
        createdComponent = createComponentData.target.createComponent(SelectorInputFieldComponent);
        const component = createdComponent.instance;

        component.label = createComponentData.labelTittle;
        //TODO esses valore serão pegos pela API
        // component.apiUrl = "http://localhost:8080/api/clientes";
        component.apiURL = createComponentData.value.apiUrl;
        //TODO fazer um verificador para ver se value carrega as informações, se não tiver, pegar algum campo
        component.displayedSelectedVariableOnInputField = "nome";
        component.returnedVariable = "id";
        //TODO fazer um verificador para ver se value carrega as informações, se não tiver, pegar algum campo
        // component.returnedVariable = value.returnedVariable;
        break;
      }
      case 'foreignKey': {
        createdComponent = createComponentData.target.createComponent(ForeignKeyInputFieldComponent);
        createdComponent.instance.label = createComponentData.labelTittle;
        createdComponent.instance.fieldName = createComponentData.fieldName;
        createdComponent.instance.value = createComponentData.value;
        // console.log("Dados para criar o componente de chave estrangeira: ",createComponentData.dataToCreatePage)
        createdComponent.instance.dataToCreatePage = createComponentData.dataToCreatePage;
        createdComponent.instance.fieldDisplayedInLabel = createComponentData.fieldDisplayedInLabel;
        break;
      }
      case 'subform': {
        createdComponent = createComponentData.target.createComponent(SubformComponent);
        const component = createdComponent.instance;
        component.JSONPath = createComponentData.dataToCreatePage;
        break;
      }
      case 'number': {
        createdComponent = createComponentData.target.createComponent(InputFieldComponent);
        createdComponent.instance.label = createComponentData.labelTittle;
        createdComponent.instance.svgIcon = "heroicons_solid:calculator";
        createdComponent.instance.isRequired = true;
        createdComponent.instance.iconPosition = "start";
        createdComponent.instance.mask = "0*,0*";
        createdComponent.instance.actionOnClickInIcon = () => { this.openDialog(CalculatorComponent, null) }

        break;
      }
      //TODO fazer o componente da imagem

      //TDO
      default: {
        return;
        break;
      }
    }

    if(createdComponent == null){ console.error("Componente não foi criado!"); return;}
    createdComponent.instance.className = createComponentData.className;
    createComponentData.resourceForm.addControl(createComponentData.fieldName, createdComponent.instance.inputValue);

  }

  openDialog(component: ComponentType<any>, dialogConfiguration: dialogConfiguration) {
    return this.matDialog.open(component, dialogConfiguration);
  }

  printForm(resourceForm: FormGroup) {
    console.log(resourceForm.value);
  }

  /**
  * Obtem os atributos principais das variáveis da classe do JSON que informa como criar as telas.
  * @param JSONDictionary Dados do JSON que irá orientar a criação das telas.
  * @returns Array com os atributos que irão orientar na criação das telas.
  */
  getAttributesData(JSONDictionary): IAttributesToCreateScreens[] {
    if (JSONDictionary == null) return;

    let attributes: IAttributesToCreateScreens[] = [];

    JSONDictionary.attributes.forEach(element => {
      let propertiesAttributes = [];
      let apiUrl = null;
      let className = null;
      let fieldDisplayedInLabel: string | null = null;

      if (element.hasOwnProperty('apiUrl') == true) {
        apiUrl = element.apiUrl;
      }

      if (element.hasOwnProperty('type') && element.type === "foreignKey" && element.hasOwnProperty('fieldDisplayedInLabel')) {
        fieldDisplayedInLabel = element.fieldDisplayedInLabel;
      }

      if (element.hasOwnProperty('properties') == true) {

        element.properties.forEach(attribute => {
          if (attribute.hasOwnProperty('name') && attribute.hasOwnProperty('type')) {
            propertiesAttributes.push({ name: attribute.name, type: attribute.type });
          }
        });
      }

      attributes.push(
        {
          name: element.name,
          type: element.type,
          formTab: element.formTab,
          apiUrl: apiUrl,
          propertiesAttributes: propertiesAttributes,
          fieldDisplayedInLabel: element.fieldDisplayedInLabel != null ? element.fieldDisplayedInLabel : null
        });
    });

    return attributes;
  }

  getConfig(JSONDictionary): any {
    if (JSONDictionary == null) return;

    return JSONDictionary.config;
  }

  getFormStepperStructure(JSONDictionary): string[] {

    if (!JSONDictionary.hasOwnProperty('config') &&
      !JSONDictionary.config.hasOwnProperty('isFormStepper') &&
      !JSONDictionary.config.hasOwnProperty('isLinearFormStepper') &&
      !JSONDictionary.config.hasOwnProperty('formTabs')) {
      return null;
    }
    if (JSONDictionary.config.hasOwnProperty('isFormStepper') == false) return null;

    return JSONDictionary.config.formTabs;
  }

  getJSONFromDicionario(JSONToGenerateScreenPath: any): Observable<any[]> {
    return this.httpClient.get<any[]>(JSONToGenerateScreenPath);//TODO aqui será a rota do backend que pegará o JSON do usuário
  }
}
