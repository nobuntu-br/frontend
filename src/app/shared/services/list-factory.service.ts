import { Injectable, ViewContainerRef } from '@angular/core';
import { FormGeneratorService } from './form-generator.service';
import { take, takeUntil } from 'rxjs';
import { DefaultListComponent } from '../components/default-list/default-list.component';
import { ISearchableField } from '../components/search-input-field/search-input-field.component';

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
    let attributes;
    let config;

    this.formGenerator.getJSONFromDicionario(JSONURL).pipe(take(1)).subscribe((dicionarioJSON) => {
      attributes = this.formGenerator.getAttributesData(dicionarioJSON);
      config = this.formGenerator.getConfig(dicionarioJSON);

      if (attributes == null) {
        alert("Não foi possível obter os dados do servidor!");
        return;
      }

      if (target == null) console.warn("Target não instanciada");

      const createdComponent = target.createComponent(DefaultListComponent).instance;
      createdComponent.apiUrl = config.apiUrl;
      createdComponent.columnsQuantity = 2;
      createdComponent.displayedfieldsName = attributes.map(attribute => attribute.name);
      createdComponent.fieldsType = attributes.map(attribute => attribute.type);
      createdComponent.isSelectable = false;
      createdComponent.selectedItemsLimit = null;
      createdComponent.searchableFields = this.getSearchableFieldsFromDataToCreatePage(dicionarioJSON);
      createdComponent.className = config.name;
      createdComponent.dataToCreatePage = dicionarioJSON;
      createdComponent.objectDisplayedValue = attributes.map(attribute => attribute.fieldDisplayedInLabel);
      createdComponent.route = config.route;
    });
  }

  /**
   * Obtem dados relacionados aos campos buscáveis dessa classe, que serão usados por componentes de pesquisa
   * @param dataToCreatePage Dados do JSON que orienda na criação das páginas
   * @returns ISearchableField[] Que contém dados do nome da variável e tipo
   */
  getSearchableFieldsFromDataToCreatePage(dataToCreatePage: object) {
    const searchableFieldsNames: string[] = dataToCreatePage["config"]["searchableFields"];

    if (searchableFieldsNames == null || searchableFieldsNames.length == 0) {
      return null;
    }

    let searchableFields: ISearchableField[] = [];

    dataToCreatePage["attributes"].forEach((attribute: object) => {
      if (attribute["name"] != null || attribute["type"] != null) {
        if (searchableFieldsNames.find((searchableFieldName: string) => searchableFieldName === attribute["name"])) {
          searchableFields.push({ name: attribute["name"], type: attribute["type"] });
        }
      }
    });

    return searchableFields;
  }
}
