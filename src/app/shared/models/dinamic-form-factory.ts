import { Injectable, Injector } from "@angular/core";
import { DateField } from "../components/input-date-field/date-field";
import { TextField } from "../components/input-field/text-field";
import { FormFactory } from "./form-Factory";
import { ICreateComponentParams } from "../services/form-generator.service";
import { ForeignKeyField } from "../components/foreign-key-input-field/foreignKey-field";
import { NumberField } from "../components/input-field/number-field";
import { SelectorField } from "../components/selector-input-field/selector-field";
import { SubFormField } from "../components/subform/subform-field";
import { FormField } from "./form-field";
import { IPageStructure } from "./pageStructure";
import { CehckboxField } from "../components/checkbox-field/checkbox-field";

@Injectable({
  providedIn: 'root'
})
export class DynamicFormFieldFactory implements FormFactory {
  constructor(private injector: Injector) { }

  createFormField(createComponentData: ICreateComponentParams, dataToCreatePage: IPageStructure): FormField {
    switch (createComponentData.fieldType) {
      case 'string': {
        return new TextField();
      }
      case 'foreignKey': {
        return new ForeignKeyField();
      }
      case 'number': {
        return new NumberField(this.injector);
      }
      case 'date': {
        return new DateField();
      }
      case 'selector': {
        return new SelectorField();
      }
      case 'subform': {
        return new SubFormField(dataToCreatePage);
      }
      case 'boolean': {
        return new CehckboxField();
      }
      case 'object': {
        return new SelectorField();
      }
      case 'manyToOne': {
          return null;
      }

      default:
        throw new Error('Unsupported field type');
    }
  }
}
