import { Injectable, ViewContainerRef } from '@angular/core';
import { FormGeneratorService } from './form-generator.service';
import { take } from 'rxjs';
import { DefaultListComponent } from '../components/default-list/default-list.component';
import { IPageStructure } from '../models/pageStructure';

// @Injectable()
@Injectable({
  providedIn: 'root'
})
export class ListFactoryService {

  constructor(
    public formGenerator: FormGeneratorService,
  ) {
  }

  /**
   * Criará a lista
   * @param target Referencia no HTML de onde será criado o componente da lista
   * @param JSONURL Caminho que se encontra o JSON que orienta na criação do componente
   */
  createList(target: ViewContainerRef, JSONURL: string) {

    this.formGenerator.getJSONFromDicionario(JSONURL).pipe(take(1)).subscribe((pageData: IPageStructure) => {

      if (pageData == null) console.warn("Dados de criação de pagina não obtidos");
      if (target == null) console.warn("Target não instanciada");

      const createdComponent = target.createComponent(DefaultListComponent).instance;
      createdComponent.apiUrl = pageData.config.apiUrl;
      createdComponent.columnsQuantity = pageData.config.columnsQuantity;
      createdComponent.title = pageData.config.title;
      createdComponent.displayedfieldsName = pageData.attributes.map(attribute => attribute.name);
      createdComponent.fieldsType = pageData.attributes.map(attribute => attribute.type);
      createdComponent.isSelectable = pageData.config.edit;
      createdComponent.selectedItemsLimit = null;
      createdComponent.searchableFields = pageData.config.searchableFields;
      createdComponent.className = pageData.config.name;
      createdComponent.dataToCreatePage = pageData;
      createdComponent.objectDisplayedValue = pageData.attributes.map(attribute => attribute.fieldDisplayedInLabel);
      createdComponent.route = pageData.config.route;
      createdComponent.visibleList = pageData.attributes.map(attribute => attribute.visibleList);
    });
  }

}
