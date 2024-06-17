import { ICreateComponentParams } from "../services/form-generator.service";
import { FormField } from "./form-field";

export interface FormFactory {
  createFormField(createComponentData: ICreateComponentParams): FormField;
}
