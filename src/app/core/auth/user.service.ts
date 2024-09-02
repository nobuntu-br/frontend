import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { UserModel } from './user.model';
import { catchError, map, Observable } from 'rxjs';
import { User } from 'oidc-client-ts';

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

  getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return null;
  }

  addUserToArrayUsersLocalStorage(user: User): void {
    // Recupera o array de usuários do localStorage
    const usersString = localStorage.getItem('users');
    const users = usersString ? JSON.parse(usersString) : [];
  
    // Verifica se o usuário já existe no array de usuários
    const userExists = users.some((usuario: any) => usuario.profile.email === user.profile.email);
  
    if (!userExists) {
      // Adiciona o novo usuário ao array se não existir
      users.push(user);
  
      // Armazena o array de volta no localStorage
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Usuário adicionado ao array users localStorage.');
    } else {
      console.log('Usuário já existe no array users localStorage.');
    }
  }

}