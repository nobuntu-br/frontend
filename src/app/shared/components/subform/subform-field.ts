import { FormField } from 'app/shared/models/form-field';
import { SubformComponent } from './subform.component';
import { FormControl } from '@angular/forms';
import { ICreateComponentParams } from 'app/shared/services/form-generator.service';

export class SubFormField implements FormField {
  createFormField(createComponentData: ICreateComponentParams): FormControl {

    let createdComponent = createComponentData.target.createComponent(SubformComponent);
    // createdComponent.JSONPath = createComponentData.dataToCreatePage;
    return null;

  }
}