import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdersTaxStatus } from "app/modules/orders-tax-status/shared/orders-tax-status.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class OrdersTaxStatusService extends BaseResourceService<OrdersTaxStatus> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/orders_tax_status"; 

    super(url, injector, OrdersTaxStatus.fromJson) 
  } 
}
