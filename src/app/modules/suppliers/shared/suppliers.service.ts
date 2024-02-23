import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suppliers } from "app/modules/suppliers/shared/suppliers.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class SuppliersService extends BaseResourceService<Suppliers> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/suppliers"; 

    super(url, injector, Suppliers.fromJson) 
  } 
}
