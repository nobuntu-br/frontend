import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { IUser, User } from './user.model';
import { catchError, map, Observable } from 'rxjs';

interface InviteUserToApplicationDTO {
  invitingUserUID: string;
  invitingUserEmail: string;//Email do usuário que está convidando alguém
  invitedUserEmail: string;//Email do usuário que está sendo convidado
  invitedUserTenantIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseResourceService<User> {

  protected http: HttpClient;
  protected usersLocalStorageKey: string = "userSessionList";
  protected currentUserSessionLocalStorageKey: string = "currentUserSession";

  constructor(
    protected override injector: Injector,
  ) { 
    var url = environment.backendUrl+"/api/user"; 
    super(url, injector, User.fromJson) 
  } 

  getByUID(UID: string): Observable<User> {
    const url = `${this.apiPath}/uid/${UID}`;

    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)      
    )
  }

  sendChangePasswordLink(email: string){
    return this.http.post<IUser>(`${this.apiPath}/send-change-password-link`, { email });
  }

  checkEmailIsUsed(email: string){
    return this.http.post(`${this.apiPath}/check-email-is-used`, { email });
  }

  inviteUser(input: InviteUserToApplicationDTO){
    return this.http.post(`${this.apiPath}/invite-user`, input);
  }

  getUserProfilePhoto(userUID: string): Observable<string> {
    return this.http.get<string>(`${this.apiPath}/get-user-profile-photo/${userUID}`);
  }
}