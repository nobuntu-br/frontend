import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'enviroment/environment';

export const authCodeFlowConfig: AuthConfig = {
  // issuer: environment.authConfig.issuer,
  issuer: environment.providerUriB2C + "/"+environment.tenantId+"/v2.0/",
  // tokenEndpoint: environment.authConfig.tokenEndpoint,
  tokenEndpoint: environment.microsoftLoginUri+'/'+environment.tenantId+"/oauth2/v2.0/token",
  // redirectUri: environment.authConfig.redirect_uri,
  redirectUri: environment.frontendUrl+"/"+environment.redirectUri,
  clientId: environment.clientId,
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  // scope: environment.authConfig.scope,
  scope: environment.providerMicrosoftUri + "/" + environment.tenantId + "/B2C_1_susi1/oauth2/v2.0/token",
  showDebugInformation: true,
}