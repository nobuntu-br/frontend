import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core'; 
import { DefaultListComponent } from 'app/shared/components/default-list/default-list.component';
import { FormGeneratorService } from 'app/shared/services/form-generator.service';
import { environment } from 'enviroment/environment';
import { Subject, takeUntil } from 'rxjs'; 

@Component({
  selector: 'app-list-purchase-order-details',
  templateUrl: './list-purchase-order-details.component.html',
  styleUrls: ['./list-purchase-order-details.component.scss']
})
export class ListPurchaseOrderDetailsComponent implements AfterViewInit,  OnDestroy  {

  displayedVariables = []; 
  attributes = []; 
  config: any; 
  userConfig; 
  searchableFields = [] 
  //apiURL: string = environment.PurchaseOrderDetailsAPIPath;//Campo que é alterável, o nome do campo "variations"+"APIPATH". 
  JSONURL: string = environment.purchaseOrderDetailsJSONPath;// Campo que é alterável, o nome do campo "variations"+"JSONPATH". 
  /** 
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado. 
   */ 
  private ngUnsubscribe = new Subject(); 

  @ViewChild('placeToRender', { read: ViewContainerRef }) target!: ViewContainerRef; 

  constructor( 
    public formGenerator: FormGeneratorService, 
  ) { } 

  ngAfterViewInit(): void { 
    this.formGenerator.getJSONFromDicionario(this.JSONURL).pipe(takeUntil(this.ngUnsubscribe)).subscribe((dicionarioJSON) => { 
      this.attributes = this.formGenerator.getAttributesData(dicionarioJSON); 
      this.config = this.formGenerator.getConfig(dicionarioJSON); 

      if(this.attributes == null){ 
        alert("Não foi possível obter os dados do servidor!"); 
        return; 
      }   

      if(this.target == null) console.warn("Target não instanciada"); 

      const createdComponent = this.target.createComponent(DefaultListComponent).instance; 
      createdComponent.apiUrl = this.config.apiUrl; 
      createdComponent.columnsQuantity = 2; 
      createdComponent.displayedfieldsName = this.attributes.map(attribute => attribute.name); 
      createdComponent.fieldsType = this.attributes.map(attribute => attribute.type); 
      createdComponent.isSelectable = false; 
      createdComponent.selectedItemsLimit = null; 
      createdComponent.searchableFields = this.searchableFields; 
      createdComponent.className = this.config.name; 
    }); 
  } 

  ngOnDestroy(): void { 
    this.ngUnsubscribe.next(null);

    this.ngUnsubscribe.complete(); 
  } 
}
