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
import { TimeField } from "../components/time-field/time-field";
import { UploadField } from "../components/upload-input-field/upload-field";
import { CaptureLocationField } from "../components/capture-location-field/capture-location-field";
import { LocationField } from "../components/location-field/location-field";
import { VideoField } from "../components/video-field/video-field";
import { PictureField } from "../components/picture-field/picture-field";
import { AvaliacaoField } from "../components/avaliacao-field/avaliacao-field";
import { AvaliacaoUnicaField } from "../components/avaliacao-unica-field/avaliacao-unica-field";

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
      case 'time': {
        return new TimeField();
      }
      case 'upload': {
        return new UploadField();
      }
      case 'captureLocation' : {
        return new CaptureLocationField();
      }
      case 'location': {
        return new LocationField();
      }
      case 'picture': {
        return new PictureField();
      }
      case 'video': {
        return new VideoField();
      }
      case 'avaliacao': {
        return new AvaliacaoField();
      }
      case 'avaliacaounica': {
        return new AvaliacaoUnicaField();
      }

      default:
        throw new Error('Unsupported field type');
    }
  }

  createFormFieldConsulta(createComponentData: ICreateComponentParams): FormField {
    console.log(createComponentData);
    switch (createComponentData.fieldType) {
      case 'string': {
        return new TextField();
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
      case 'boolean': {
        return new CehckboxField();
      }

      default:
        throw new Error('Unsupported field type');
    }
  }
}
