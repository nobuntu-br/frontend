import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'enviroment/environment';

export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.authConfig.issuer,
  tokenEndpoint: environment.authConfig.tokenEndpoint,
  redirectUri: environment.authConfig.redirect_uri,
  clientId: environment.authConfig.client_id,
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope: environment.authConfig.scope,
  showDebugInformation: true
}