import { Injectable, Injector } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesReports } from "app/modules/sales-reports/shared/sales-reports.model";
import { BaseResourceService } from 'app/shared/services/shared.service'; 
import { environment } from 'enviroment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class SalesReportsService extends BaseResourceService<SalesReports> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/sales_reports"; 

    super(url, injector, SalesReports.fromJson) 
  } 
}
