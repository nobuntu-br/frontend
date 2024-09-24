import { FormControl } from '@angular/forms';
import { FormField } from 'app/shared/models/form-field';
import { ICreateComponentParams } from 'app/shared/services/form-generator.service';
import { CheckboxFieldComponent } from './checkbox-field.component';

export class CehckboxField implements FormField {
	createFormField(createComponentData: ICreateComponentParams): FormControl {
		let createdComponent = createComponentData.target.createComponent(CheckboxFieldComponent);
        const component = createdComponent.instance;

        component.label = createComponentData.labelTittle;
        return createdComponent.instance.inputValue;
	}
}