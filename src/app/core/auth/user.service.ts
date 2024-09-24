import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { IUser, IUserAccessInfo, User } from './user.model';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseResourceService<User> {

  protected http: HttpClient;
  protected usersLocalStorageKey: string = "users";
  protected currentUserLocalStorageKey: string = "currentUser";

  constructor(protected override injector: Injector) { 
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

  async addUserOnLocalStorage(user: IUser): Promise<void> {
    // Recupera o CurrentUser do localStorage
    const userString = localStorage.getItem(this.currentUserLocalStorageKey);
    const currentUser = userString ? JSON.parse(userString) : [];

    // Recupera o array de usuários do localStorage
    const usersString = localStorage.getItem(this.usersLocalStorageKey);
    const users = usersString ? JSON.parse(usersString) : [];
    
    // Verifica se o usuário já existe no array de usuários
    const currentUserExists = currentUser.email === user.email;

    // Verifica se o usuário já existe no array de usuários
    const userExists = users.some((usuario: any) => usuario.email === user.email);
    console.log(userExists)
    if (!userExists) {
      // Armazena o currentUser no localStorage
      localStorage.setItem(this.currentUserLocalStorageKey, JSON.stringify(user));
      console.log('Usuário adicionado a CurrentUser.');
    } else {
      localStorage.setItem(this.currentUserLocalStorageKey, JSON.stringify(user));
      console.log('Usuário já é currentUser');
    }

    if (!currentUserExists) {
      // Adiciona o novo usuário ao array se não existir
      users.push(user);

      // Armazena o array de volta no localStorage
      localStorage.setItem(this.usersLocalStorageKey, JSON.stringify(users));
      console.log('Usuário adicionado ao array users localStorage.');
    } else {
      console.log('Usuário já existe no array users localStorage.');
    }
  }

  getCurrentUserFromStorage(): IUser | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      return JSON.parse(userJson) as IUser;
    }
    return null;
  }

  getUsersFromLocalstorage(): IUser[] {
    return JSON.parse(localStorage.getItem(this.usersLocalStorageKey) || '[]');
  }
  
  getUserFromLocalStorageByUID(userUID: string): IUser | null {
    const users : IUser [] = this.getUsersFromLocalstorage();
    return users.find(user => user.UID === userUID) || null;
  }

  getAnyUserFromLocalStorage(): IUser | null {
    const users : IUser [] = this.getUsersFromLocalstorage();
    if(users == null || users.length == 0){
      return null;
    }

    return users[0];
  }

  //TODO essa função deverá retornar o array com todos as contas de usuário no localStorate. Precisa formalizar saída dela com uma Interface
  deleteUserFromLocalStorage(userUID: string): string | null {
    // Recupera o array de usuários do localStorage
    const usersString = localStorage.getItem(this.usersLocalStorageKey);
    var users = usersString ? JSON.parse(usersString) : [];

    // Verifica se o usuário já existe no array de usuários
    const userExists = users.some((user: any) => user.UID === userUID);

    if (userExists) {
      // Remove o usuário
      users = users.filter(user => user.UID !== userUID);

      // Armazena o array de volta no localStorage
      localStorage.setItem(this.usersLocalStorageKey, JSON.stringify(users));
      
      console.log('Usuário removido do array users localStorage.');
    } else {
      console.log('Usuário não existe no array users localStorage.');
      return null;
    }

    return userUID;
  }
  
  checkEmailExist(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiPath}/check-email-exist`, { email });
  }
  
  sendVerificationEmailCodeToEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiPath}/send-verification-email-code`, { email });
  }

  verifyCodeSentToEmail(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiPath}/verify-code`, { email, code });
  }
}