import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authorizationEndpoint = 'https://example.com/auth'; // URL de autorização
  private tokenEndpoint = 'https://example.com/token'; // URL de troca de token
  private clientId = 'seuClientId'; // ID de cliente
  private redirectUri = 'http://localhost:4200/callback'; // URL de redirecionamento
  private clientSecret = 'seuClientSecret'; // Segredo de cliente

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  redirectToAuthorization() {
    const redirectUrl = `${this.authorizationEndpoint}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=seu_escopo`;
    window.location.href = redirectUrl;
  }

  exchangeAuthorizationCode(code: string) {
    const body = `code=${code}&grant_type=authorization_code&redirect_uri=${this.redirectUri}&client_id=${this.clientId}&client_secret=${this.clientSecret}`;
    return this.http.post(this.tokenEndpoint, body);
  }

  storeAccessToken(token: string) {
    this.localStorage.set('access_token', token);
  }

  getAccessToken() {
    return this.localStorage.get('access_token');
  }

  isAuthenticated() {
    return !!this.getAccessToken();
  }
}