import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryTransactionTypes } from "app/modules/inventory-transaction-types/shared/inventory-transaction-types.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionTypesService extends BaseResourceService<InventoryTransactionTypes> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/inventory_transaction_types"; 

    super(url, injector, InventoryTransactionTypes.fromJson) 
  } 
}
