import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Application {
  displayName: string;
  icon: string | null;
  redirect_uri: string | null; // Renomeado de spaRedirectUris para redirect_uri
  client_id: string | null; // Renomeado de clientId para client_id
  scope: string | null; // Novo campo baseado em identifierUri e scopes
  post_logout_redirect_uri: string | null; // Renomeado de logoutUrl para post_logout_redirect_uri
}

  
@Injectable({
  providedIn: 'root'
})

export class ApplicationService {
  private apiUrl = environment.backendUrl+'/api/token/getApplication'; // URL do seu servidor Node.js

  constructor(private http: HttpClient) { }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }
}

