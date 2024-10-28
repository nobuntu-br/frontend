import { FormControl } from '@angular/forms';
import { FormField } from 'app/shared/models/form-field';
import { ICreateComponentParams } from 'app/shared/services/form-generator.service';
import { TimeFieldComponent } from './time-field.component';

export class TimeField implements FormField {
	createFormField(createComponentData: ICreateComponentParams): FormControl {

        let createdComponent = createComponentData.target.createComponent(TimeFieldComponent);
        createdComponent.instance.label = createComponentData.labelTittle;
        createdComponent.instance.isRequired = createComponentData.isRequired;
        createdComponent.instance.className = createComponentData.className;
        createdComponent.instance.defaultValue = createComponentData.defaultValue;
        return createdComponent.instance.inputValue;
      }
}