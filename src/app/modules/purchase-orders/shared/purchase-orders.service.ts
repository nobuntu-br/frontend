import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrders } from "app/modules/purchase-orders/shared/purchase-orders.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrdersService extends BaseResourceService<PurchaseOrders> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/purchase_orders"; 

    super(url, injector, PurchaseOrders.fromJson) 
  } 
}
