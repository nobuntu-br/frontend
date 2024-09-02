import { Injectable } from "@angular/core";
import { AuthUtils } from "./auth.utils";

@Injectable({
    providedIn: 'root'
  })
  export class TokenService {
    constructor() {}
  
    getToken(): string | null {
      // Aqui você pode acessar o token de algum lugar, como localStorage
      return localStorage.getItem('accessToken');
    }
  
    isTokenExpired(token: string): boolean {
      // Use AuthUtils para verificar se o token está expirado
      return AuthUtils.isTokenExpired(token);
    }
  }
  
