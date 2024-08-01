import { AfterViewInit, Component, EventEmitter, Input, Optional, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGeneratorService, ICreateComponentParams } from 'app/shared/services/form-generator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IPageStructure } from 'app/shared/models/pageStructure';
import { MatStepper } from '@angular/material/stepper';

/**
 * Componente que fará a geração do formulário. Sendo esse formulário o com estrutura simples.
 */
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
  /**
   * Dados contidos no JSON que orienta a criação da página
   */
  @Input() dataToCreatePage: IPageStructure;

  /**
   * Nome da classe na qual o formulário pertence.
   * @example "Produtos"
   */
  @Input() className: string;


  @ViewChild('placeToRender', { read: ViewContainerRef }) target!: ViewContainerRef;

  constructor(
    public formGenerator: FormGeneratorService,
  ) { }

  ngAfterViewInit(): void {
    this.generateSimpleFormList();
  }

  /**
   * Função que irá criar cada campo de preenchimento de acordo com as variáveis da classe do formulário.
   */
  generateSimpleFormList() {
    setTimeout(() => {
      this.dataToCreatePage.attributes.forEach((attribute) => {

        const createComponentData : ICreateComponentParams = {
          target:this.target,
          resourceForm: this.resourceForm,
          className: this.className,
          fieldName: attribute.name,
          fieldType: attribute.type,
          isRequired: attribute.isRequired ? attribute.isRequired : false,
          value: {propertiesAttributes: attribute.properties, apiUrl: attribute.apiUrl},
          labelTittle: attribute.name,
          dataToCreatePage: this.dataToCreatePage,
          fieldDisplayedInLabel: attribute.fieldDisplayedInLabel,
          valuesList: null
        }

        this.formGenerator.createComponent(createComponentData)

      });
      this.formIsReady.emit(true);
    }, 0);
  }
}
