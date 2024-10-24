import { FormControl } from '@angular/forms';
import { FormField } from 'app/shared/models/form-field';
import { ICreateComponentParams } from 'app/shared/services/form-generator.service';
import { UploadInputFieldComponent } from './upload-input-field.component';

export class UploadField implements FormField {
	createFormField(createComponentData: ICreateComponentParams): FormControl {
		let createdComponent = createComponentData.target.createComponent(UploadInputFieldComponent);
        const component = createdComponent.instance;

        component.label = createComponentData.labelTittle;
        component.valuesList = createComponentData.valuesList;
        component.selectItemsLimit = createComponentData.selectItemsLimit;
        component.allowedExtensions = createComponentData.allowedExtensions;
        component.ngAfterViewInit();
		return createdComponent.instance.inputValue;
	}
}