import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TenantService } from './tenant.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  /**
   * Constructor
   */
  constructor(
    private tenantService: TenantService,
    private authService: AuthService
  ) { }

  /**
   * Interceptará antes de ser feito a requisição para a API e irá inserir o identificador (ID) do tenant que será usado na requisição
   * @param req Informações da requisição
   * @param next 
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentTenant = this.tenantService.currentTenant;
    if (currentTenant != null) {

      req = req.clone({
        headers: req.headers.set('X-Tenant-ID', currentTenant.TenantCredentialId.toString())
      });

    }
    
    return next.handle(req).pipe(
      // Caso ocorreu algum erro
      catchError((error) => {

        // Caso obter "401 Unauthorized" (status de não autorizado para fazer a requisição) como erro
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log(error.message);
          this.tenantService.getAllTenantsAndSaveInLocalStorage(this.authService.currentUser.UID);

          //TODO fazer tratativas para erros relacionados a ausência do código ou a perda de permissão de acesso ao tenant
        }

        return throwError(error);
      })
    );
  }
}
