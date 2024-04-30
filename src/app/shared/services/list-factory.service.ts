import { Injectable, ViewContainerRef } from '@angular/core';
import { FormGeneratorService } from './form-generator.service';
import { take, takeUntil } from 'rxjs';
import { DefaultListComponent } from '../components/default-list/default-list.component';

// @Injectable()
@Injectable({
  providedIn: 'root'
})
export class ListFactoryService {

  constructor(
    public formGenerator: FormGeneratorService, 
  ){
  }

  /**
   * Criará a lista
   * @param target Referencia no HTML de onde será criado o componente da lista
   * @param JSONURL Caminho que se encontra o JSON que orienta na criação do componente
   */
  createList(target : ViewContainerRef, JSONURL: string){
    let attributes;
    let config;

    this.formGenerator.getJSONFromDicionario(JSONURL).pipe(take(1)).subscribe((dicionarioJSON) => { 
      attributes = this.formGenerator.getAttributesData(dicionarioJSON); 
      config = this.formGenerator.getConfig(dicionarioJSON); 

      if(attributes == null){ 
        alert("Não foi possível obter os dados do servidor!"); 
        return; 
      }   

      if(target == null) console.warn("Target não instanciada"); 

      const createdComponent = target.createComponent(DefaultListComponent).instance; 
      createdComponent.apiUrl = config.apiUrl; 
      createdComponent.columnsQuantity = 2; 
      createdComponent.displayedfieldsName = attributes.map(attribute => attribute.name); 
      createdComponent.fieldsType = attributes.map(attribute => attribute.type); 
      createdComponent.isSelectable = false; 
      createdComponent.selectedItemsLimit = null; 
      createdComponent.searchableFields = config.searchableFields ? config.searchableFields: [];//TODO é preociso obter essa informaçào do JSON 
      createdComponent.className = config.name; 
      createdComponent.dataToCreatePage = dicionarioJSON;
      createdComponent.objectDisplayedValue = attributes.map(attribute => attribute.fieldDisplayedInLabel);
      createdComponent.route = config.route;
    }); 
  }
}
