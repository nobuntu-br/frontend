import { FormControl } from '@angular/forms';
import { FormField } from '../../models/form-field';
import { ICreateComponentParams } from '../../services/form-generator.service';
import { InputFieldComponent } from './input-field.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injector } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';

interface dialogConfiguration {
  width?: string,
  height?: string,
  maxWidth?: string,
  maxHeight?: string,
  panelClass?: string,
  data?: any,
}

export class NumberField implements FormField {


  matDialog: MatDialog;
  protected translocoService: TranslocoService;

  
  constructor(private injector: Injector) {
    this.translocoService = injector.get(TranslocoService);
    this.matDialog = injector.get(MatDialog);
  }

  createFormField(createComponentData: ICreateComponentParams): FormControl {

    // let createdComponent = createComponentData.target.createComponent(InputFieldComponent);
    // createdComponent.instance.label = createComponentData.labelTittle;
    // createdComponent.instance.isRequired = createComponentData.isRequired;
    // createdComponent.instance.svgIcon = "heroicons_solid:calculator";
    // createdComponent.instance.iconPosition = "start";
    // createdComponent.instance.mask = "0*,0*";
    // createdComponent.instance.actionOnClickInIcon = () => { this.openDialog(CalculatorComponent, {data: {formData: createdComponent.instance.inputValue.value}}) }
    // createdComponent.instance.className = createComponentData.className;
    // return createdComponent.instance.inputValue;
    let createdComponent = createComponentData.target.createComponent(InputFieldComponent);
        createdComponent.instance.label = createComponentData.labelTittle;
        createdComponent.instance.svgIcon = "heroicons_solid:calculator";
        createdComponent.instance.isRequired = true;
        createdComponent.instance.iconPosition = "start";

        createdComponent.instance.actionOnClickInIcon = () => { this.openDialog(CalculatorComponent, null) }
        var calculatorDialogRef: MatDialogRef<CalculatorComponent>;//Referência da calculadora que será aberta com o dialog
        createdComponent.instance.actionOnClickInIcon = () => { 
          console.log("Valor atual do campo numérico do formulário: ",createdComponent.instance.inputValue.value);
          calculatorDialogRef = this.openDialog(CalculatorComponent, {data: {formData: createdComponent.instance.inputValue.value}});//Criar a calculadora

          //Toda vez que a calculadora for criada, será criado um observador que informará quando a calculadora será fechada
          calculatorDialogRef.afterClosed().pipe(take(1)).subscribe(result => {
            var calculatorResult = result.toString();
            createdComponent.instance.inputValue.setValue(calculatorResult);
          });
        };
        return createdComponent.instance.inputValue;
  }

  openDialog(component: ComponentType<any>, dialogConfiguration: dialogConfiguration) {
    return this.matDialog.open(component, dialogConfiguration);
  }
}