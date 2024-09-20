import { FormControl } from '@angular/forms';
import { FormField } from 'app/shared/models/form-field';
import { ICreateComponentParams } from 'app/shared/services/form-generator.service';
import { SelectorInputFieldComponent } from './selector-input-field.component';

export class SelectorField implements FormField {
	createFormField(createComponentData: ICreateComponentParams): FormControl {

		let createdComponent = createComponentData.target.createComponent(SelectorInputFieldComponent);
        const component = createdComponent.instance;

        component.label = createComponentData.labelTittle;
        // createdComponent.instance.isRequired = createComponentData.isRequired;// TODO adicionar campo se é requerido ou não
        //TODO esses valore serão pegos pela API
        // component.apiUrl = "http://localhost:8080/api/clientes";
        component.apiUrl = createComponentData.value.apiUrl;
        //TODO fazer um verificador para ver se value carrega as informações, se não tiver, pegar algum campo
        component.displayedSelectedVariableOnInputField = "nome";
        component.returnedVariable = "id";
        //TODO fazer um verificador para ver se value carrega as informações, se não tiver, pegar algum campo
        // component.returnedVariable = value.returnedVariable;
		return createdComponent.instance.inputValue;
	}
}