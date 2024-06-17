import { FormControl } from '@angular/forms';
import { FormField } from '../../models/form-field';
import { ICreateComponentParams } from '../../services/form-generator.service';
import { InputFieldComponent } from './input-field.component';

export class TextField implements FormField {
  createFormField(createComponentData: ICreateComponentParams): FormControl {
    
    let createdComponent = createComponentData.target.createComponent(InputFieldComponent);
    createdComponent.instance.label = createComponentData.labelTittle;
    createdComponent.instance.isRequired = createComponentData.isRequired;
    createdComponent.instance.isRequired = createComponentData.isRequired;
    createdComponent.instance.className = createComponentData.className;
    return createdComponent.instance.inputValue;
  }
}