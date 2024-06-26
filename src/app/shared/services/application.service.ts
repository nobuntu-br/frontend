import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Application {
    name: string;
    icon: string | null;
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

