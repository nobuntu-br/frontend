import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetailsStatus } from "app/modules/order-details-status/shared/order-details-status.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsStatusService extends BaseResourceService<OrderDetailsStatus> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/order_details_status"; 

    super(url, injector, OrderDetailsStatus.fromJson) 
  } 
}
