import { FormControl } from '@angular/forms';
import { FormField } from '../../models/form-field';
import { ICreateComponentParams } from '../../services/form-generator.service';
import { ForeignKeyInputFieldComponent } from './foreign-key-input-field.component';

export class ForeignKeyField implements FormField {
    createFormField(createComponentData: ICreateComponentParams): FormControl {

        let createdComponent = createComponentData.target.createComponent(ForeignKeyInputFieldComponent);
        createdComponent.instance.label = createComponentData.labelTittle;
        createdComponent.instance.isRequired = createComponentData.isRequired;
        createdComponent.instance.fieldName = createComponentData.fieldName;
        createdComponent.instance.value = createComponentData.value;
        createdComponent.instance.dataToCreatePage = createComponentData.dataToCreatePage;
        createdComponent.instance.fieldDisplayedInLabel = createComponentData.fieldDisplayedInLabel;
        createdComponent.instance.className = createComponentData.className;
        
        return createdComponent.instance.inputValue;
    }
}