import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetails } from "app/modules/order-details/shared/order-details.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService extends BaseResourceService<OrderDetails> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/order_details"; 

    super(url, injector, OrderDetails.fromJson) 
  } 
}
