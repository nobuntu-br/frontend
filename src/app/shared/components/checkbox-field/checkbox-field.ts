import { FormControl } from '@angular/forms';
import { FormField } from '../../models/form-field';
import { ICreateComponentParams } from '../../services/form-generator.service';
import { CheckboxFieldComponent } from './checkbox-field.component';

export class CheckboxField implements FormField {
  createFormField(createComponentData: ICreateComponentParams): FormControl {
    
    let createdComponent = createComponentData.target.createComponent(CheckboxFieldComponent);
    createdComponent.instance.label = createComponentData.labelTittle;
    createdComponent.instance.isRequired = createComponentData.isRequired;
    createdComponent.instance.isRequired = createComponentData.isRequired;
    createdComponent.instance.className = createComponentData.className;
    return createdComponent.instance.inputValue;
  }
}