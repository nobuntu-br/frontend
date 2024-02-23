import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdersStatus } from "app/modules/orders-status/shared/orders-status.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class OrdersStatusService extends BaseResourceService<OrdersStatus> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/orders_status"; 

    super(url, injector, OrdersStatus.fromJson) 
  } 
}
