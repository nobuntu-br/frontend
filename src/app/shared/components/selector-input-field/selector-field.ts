import { FormControl } from '@angular/forms';
import { FormField } from 'app/shared/models/form-field';
import { ICreateComponentParams } from 'app/shared/services/form-generator.service';
import { SelectorInputFieldComponent } from './selector-input-field.component';

export class SelectorField implements FormField {
	createFormField(createComponentData: ICreateComponentParams): FormControl {
        console.log(createComponentData);
        console.log(createComponentData.dataToCreatePage.attributes[createComponentData.index].optionList);
		let createdComponent = createComponentData.target.createComponent(SelectorInputFieldComponent);
        const component = createdComponent.instance;

        component.label = createComponentData.labelTittle;
        component.valuesList = createComponentData.dataToCreatePage.attributes[createComponentData.index].optionList;
        component.selectItemsLimit = createComponentData.dataToCreatePage.attributes[createComponentData.index].selectItemsLimit;
        component.ngAfterViewInit();
		return createdComponent.instance.inputValue;
	}
}