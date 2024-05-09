import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { Session } from './session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseResourceService<Session> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/session"; 

    super(url, injector, Session.fromJson) 
  } 
}
