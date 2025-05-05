import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormField } from '../models/form-field';
import { DynamicFormFieldFactory } from '../models/dinamic-form-factory';
import { IPageStructure, PageStructure } from '../models/pageStructure';

interface IconOption {
  nome: string;
  valor: number;
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
  limiteOfChars: number, //criado novo
  isRequired: boolean,
  value,
  labelTittle: string,
  dataToCreatePage: PageStructure,
  fieldDisplayedInLabel: string,
  valuesList: any[],
  index: number,
  defaultValue: any,
  allowedExtensions?: string[];
  optionList?: any[],
  selectItemsLimit?: number,
  dataType?: string,
  language?: string,
  icones?: IconOption[]
  mask?: string;
  maxFileSize?: number;
  maskType?: string; // criado novo
  charactersLimit?: number; 
  numberOfIcons?: number[],  //criado novo
  conditionalVisibility?: { field: string, values: string[] };  //criado novo
  locationMarker?: { lat: number, lng: number, quadrant?: string }; //criado novo
  needMaskValue?: boolean; //criado novo
  numberOfDecimals?: number; //criado novo
  decimalSeparator?: string; //criado novo
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

  constructor(protected injector: Injector, private formFieldFactory: DynamicFormFieldFactory) {
    this.httpClient = injector.get(HttpClient);
    this.formBuilder = injector.get(FormBuilder);
    this.matDialog = injector.get(MatDialog);
  }

  buildResourceForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      id: [null],
    });
  }

  createComponent(
    createComponentData: ICreateComponentParams
  ) {

    if (createComponentData.target == null) {
      console.error("Target vazia, não é possível criar a pagina");
      return null;
    }

    const formField: FormField = this.formFieldFactory.createFormField(createComponentData, createComponentData.dataToCreatePage);

    if (formField == null) {
      return null;
    }

    createComponentData.resourceForm.addControl(
      createComponentData.fieldName, 
      formField.createFormField(createComponentData)
    );

    if (createComponentData.isRequired) {
      createComponentData.resourceForm.controls[createComponentData.fieldName].setValidators(Validators.required);
    }
  }

  //TODO remover essa função
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

  getJSONFromDicionario(JSONToGenerateScreenPath: any): Observable<IPageStructure> {
    return this.httpClient.get<IPageStructure>(JSONToGenerateScreenPath);//TODO aqui será a rota do backend que pegará o JSON do usuário
  }

  createForm(dataToCreatePage: IPageStructure) {
    const formGroup = this.buildResourceForm(this.formBuilder);
    this.createFormFields(dataToCreatePage, formGroup);
  }

  createFormFields(dataToCreatePage: IPageStructure, formGroup: FormGroup) {
    dataToCreatePage.attributes.forEach((attribute, index) => {
      this.createComponent({
        target: null,
        resourceForm: formGroup,
        className: attribute.className,
        fieldName: attribute.name,
        fieldType: attribute.type,
        limiteOfChars: attribute.limiteOfChars, //criado novo
        isRequired: attribute.isRequired,
        value: attribute.apiUrl,
        labelTittle: attribute.name,
        dataToCreatePage: null,
        fieldDisplayedInLabel: attribute.fieldDisplayedInLabel,
        defaultValue: attribute.defaultValue,
        valuesList: null,
        dataType: attribute.type,
        index: index,
        allowedExtensions: attribute.allowedExtensions,
        optionList: attribute.optionList,
        selectItemsLimit: attribute.selectItemsLimit,
        charactersLimit: attribute.charactersLimit,
        numberOfIcons: attribute.numberOfIcons, //criado novo
        conditionalVisibility: attribute.conditionalVisibility,  //criado novo
        locationMarker: attribute.locationMarker, //criado novo
        maskType: attribute.mask, //criado novo
        needMaskValue: attribute.needMaskValue, //criado novo
        numberOfDecimals: attribute.numberOfDecimals, //criado novo
        decimalSeparator: attribute.decimalSeparator, //criado novo
      });
    });
  }
}
