import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrderStatus } from "app/modules/purchase-order-status/shared/purchase-order-status.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderStatusService extends BaseResourceService<PurchaseOrderStatus> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/purchase_order_status"; 

    super(url, injector, PurchaseOrderStatus.fromJson) 
  } 
}
