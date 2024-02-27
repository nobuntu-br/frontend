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

interface dialogConfiguration {
  width?: string,
  height?: string,
  maxWidth?: string,
  maxHeight?: string,
  panelClass?: string,
  data?: any,
}

export interface IAttributes {
  name: string,
  type: string,
  formTab: string,
  apiUrl?: string,
  propertiesAttributes?: any[]
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

  constructor(protected injector: Injector) {
    this.httpClient = injector.get(HttpClient);
    this.formBuilder = injector.get(FormBuilder);
  }

  buildResourceForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      id: [null],
    });
  }

  //TODO remover código repetitivo
  createComponent(
    target: ViewContainerRef,
    resourceForm: FormGroup,
    matDialog: MatDialog,
    className: string,
    fieldName: string,
    fieldType: string,
    value,
    labelTittle: string,
    JSONPath: string,
    valuesList: any[] = null
  ) {

    if (target == null) {
      console.error("Target vazia, não é possível criar a pagina");
      return null;
    }

    let createdComponent;
    switch (fieldType) {
      case 'date': {
        createdComponent = target.createComponent(InputDateFieldComponent);
        createdComponent.instance.label = labelTittle;
        
        break;
      }
      case 'string': {
        createdComponent = target.createComponent(InputFieldComponent);
        createdComponent.instance.label = labelTittle;
        createdComponent.instance.isRequired = true;
        
        // createdComponent.instance.svgIcon = "heroicons_solid:user";
        //createdComponent.instance.actionOnClickInIcon = ()=>{console.log("Você apertou no icone")}

        break;
      }
      case 'object': {
        createdComponent = target.createComponent(SelectorInputFieldComponent);
        const component = createdComponent.instance;

        component.label = labelTittle;
        component.valuesList = [{ productId: "65b812adaff84eff40be3924", variationCode: "13022" }, { productId: "AAABBB", variationCode: "0002" }];
        // component.valuesList = valuesList;
        component.displayedSelectedVariableOnInputField = "variationCode";
        //TODO fazer um verificador para ver se value carrega as informações, se não tiver, pegar algum campo
        // component.displayedSelectedVariableOnInputField = value.displayedSelectedVariableOnInputField;
        component.returnedVariable = "productId";
        //TODO fazer um verificador para ver se value carrega as informações, se não tiver, pegar algum campo
        // component.returnedVariable = value.returnedVariable;
        break;
      }
      case 'foreignKey': {
        createdComponent = target.createComponent(ForeignKeyInputFieldComponent);
        createdComponent.instance.label = labelTittle;
        createdComponent.instance.fieldName = fieldName;
        createdComponent.instance.value = value;
        createdComponent.instance.JSONPath = JSONPath;
        createdComponent.instance.fieldDisplayedInLabel = "firstName";

        break;
      }
      case 'array': {
        createdComponent = target.createComponent(ForeignKeyInputFieldComponent);
        createdComponent.instance.label = labelTittle;
        createdComponent.instance.apiUrl = "http://localhost:8080/api/employees";//get address from .env and concat
        createdComponent.instance.fieldsDisplayed = ['firstName', "lastName", "company", 'city', "businessPhone", "createdAt"];
        createdComponent.instance.fieldsType = ['string', 'string', 'string', 'string', 'string', 'date'];
        createdComponent.instance.columnsQuantity = 3;
        createdComponent.instance.fieldDisplayedInLabel = "firstName";

        createdComponent.instance.searchableFields = ["firstName", "company"];
        break;
      }
      case 'number': {
        createdComponent = target.createComponent(InputFieldComponent);
        createdComponent.instance.label = labelTittle;
        createdComponent.instance.svgIcon = "heroicons_solid:calculator";
        createdComponent.instance.isRequired = true;
        createdComponent.instance.iconPosition = "start";
        createdComponent.instance.mask = "0*,0*";
        createdComponent.instance.actionOnClickInIcon = () => { this.openDialog(matDialog, CalculatorComponent, null) }

        break;
      }
      case 'list': {
        createdComponent = target.createComponent(DefaultListComponent);
        // createdComponent.instance.label = labelTittle;
        createdComponent.instance.columnsQuantity = 3;
        createdComponent.instance.fieldsDisplayed = ['firstName', "lastName", "company", 'city', "businessPhone", "createdAt"];
        createdComponent.instance.fieldsType = ['string', 'string', 'string', 'string', 'string', 'date'];
        createdComponent.instance.apiUrl = "http://localhost:8080/api/employees";
        createdComponent.instance.selectedItemsLimit = 4;
        createdComponent.instance.searchableFields = ["firstName", "company"];

        break;
      }
      //TODO fazer o componente da imagem

      //TDO 
      default: {
        return;
        break;
      }
    }

    createdComponent.instance.className = className;
    resourceForm.addControl(fieldName, createdComponent.instance.inputValue);

  }

  //TODO verificar se essa responsabilidade de abrir dialog deve ficar aqui ou dentro do componente responsável
  openDialog(matDialog: MatDialog, component: ComponentType<any>, dialogConfiguration: dialogConfiguration) {
    return matDialog.open(component, dialogConfiguration);
  }

  printForm(resourceForm: FormGroup) {
    console.log(resourceForm.value);
  }

  /**
   * Obtem os atributos principais das variáveis da classe do JSON que informa como criar as telas
   * @param JSONDictionary JSON que informa como criar as telas
   * @returns Informações para criação dinâmica dos componentes. \
   * Sendo um vetor com os seguintes campos: \
   * @name - nome da variável.
   * @type - tipo da variável. 
   * @formTab - informação de para qual aba do formTab essa variável pertence.
   * @apiUrl link para chamar a classe dessa variável.
   * @propertiesAttributes Se a variável for uma classe, retorná um vetor com variavel com nome e tipo das variáveis que contém na classe).
   */
  getAttributesData(JSONDictionary): IAttributes[] {
    if (JSONDictionary == null) return;

    let attributes: IAttributes[] = [];

    JSONDictionary.attributes.forEach(element => {
      let propertiesAttributes = [];
      let apiUrl = null;
      let className = null;

      if(element.hasOwnProperty('apiUrl') == true){
        apiUrl = element.apiUrl;
      }

      if(element.hasOwnProperty('properties') == true){
        
        element.properties.forEach(attribute =>{
          if(attribute.hasOwnProperty('name') && attribute.hasOwnProperty('type')){
            propertiesAttributes.push({name: attribute.name, type: attribute.type});
          }
        });
      }

      attributes.push({ name: element.name, type: element.type, formTab: element.formTab, apiUrl: apiUrl, propertiesAttributes: propertiesAttributes });
    });

    return attributes;
  }

  getConfig(JSONDictionary): any {
    if (JSONDictionary == null) return;

    return JSONDictionary.config;
  }

  /**
   * @deprecated Obtem nome das variáveis da classe do JSON que informa como criar as telas
   * @param JSONDictionary JSON que informa como criar as telas
   * @returns Array com nome das variáveis
   */
  getAttributesName(JSONDictionary) {
    if (JSONDictionary == null) return;
    let attributesName = [];

    JSONDictionary.attributes.forEach(element => {
      attributesName.push(element.name);
    });

    return attributesName;
  }

  /**
   * @deprecated Obtem a tipagem das variáveis da classe do JSON que informa como criar as telas
   * @param JSONDictionary JSON que informa como criar as telas
   * @returns Array os tipos das variáveis
   */
  getAttributesType(JSONDictionary): string[] {
    if (JSONDictionary == null) return;
    let attributesType = [];

    JSONDictionary.attributes.forEach(element => {
      attributesType.push(element.type);
    });

    return attributesType;
  }

  //TODO remover
  getAttributesFormTab(JSONDictionary): string[] {
    if (JSONDictionary == null) return;
    let attributesType = [];

    if (!JSONDictionary.attributes.hasOwnProperty('formTabs')) return;

    JSONDictionary.attributes.formTabs.forEach(element => {
      attributesType.push(element.type);
    });

    return attributesType;
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
