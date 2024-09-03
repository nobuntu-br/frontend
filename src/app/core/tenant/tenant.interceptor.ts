import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  /**
   * Constructor
   */
  constructor(private tenantService: TenantService) { }

  /**
   * Interceptará antes de ser feito a requisição para a API e irá inserir o identificador (ID) do tenant que será usado na requisição
   * @param req Informações da requisição
   * @param next 
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentTenant = this.tenantService.currentTenant;

    if (currentTenant != null) {

      req = req.clone({
        headers: req.headers.set('X-Tenant-ID', currentTenant.TenantId.toString())
      });

    }

    return next.handle(req).pipe(
      // Caso ocorreu algum erro
      catchError((error) => {

        // Caso obter "401 Unauthorized" (status de não autorizado para fazer a requisição) como erro
        if (error instanceof HttpErrorResponse && error.status === 500) {
          //TODO fazer tratativas para erros relacionados a ausência do código ou a perda de permissão de acesso ao tenant
        }

        return throwError(error);
      })
    );
  }
}
