import { FormControl } from "@angular/forms";
import { ICreateComponentParams } from "../services/form-generator.service";
import { IPageStructure } from "./pageStructure";

export interface FormField {
  createFormField(createComponentData: ICreateComponentParams, dataToCreatePage: IPageStructure): FormControl;
}