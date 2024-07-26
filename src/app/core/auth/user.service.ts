import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { UserModel } from './user.model';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseResourceService<UserModel> {

  protected http: HttpClient 

  constructor(protected override injector: Injector) { 
    var url = environment.backendUrl+"/api/user"; 

    super(url, injector, UserModel.fromJson) 
  } 

  getByUID(UID: string): Observable<UserModel> {
    // return this._httpClient.get<object>(environment.backendUrl + "/api/user/uid/" + userUID);
    const url = `${this.apiPath}/uid/${UID}`;

    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)      
    )
  }

}