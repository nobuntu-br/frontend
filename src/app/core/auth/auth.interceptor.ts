import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { TenantService } from '../tenant/tenant.service';
import { Router } from '@angular/router';

/**
 * Intercepta toda requisição adicionando ao cabeçario identificador do usuário da sessão atual, ou seja, usuário que está fazendo a requisição e também identificador do banco de dados que está sendo usado pelo usuário na requisição.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private hasTriedToRefresh: boolean = false;
  /**
   * Constructor
   */
  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
    private router: Router
  ) {
  }

  /**
   * Intercepta a requisição informando dados de usuário e banco de dados usado para API.
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq = req.clone();

    //Indica qual usuário está fazendo a requisição
    let userSession: string = "";
    //Indica qual tenant (banco de dados) será a requisição
    let databaseUsedInRequest: string = "";

    if (this.authService.currentUserSession != null) {
      userSession = String(this.authService.currentUserSession.user.id);
    }

    if (this.tenantService.currentTenant != null) {
      databaseUsedInRequest = String(this.tenantService.currentTenant.databaseCredential.id);
    }

    newReq = req.clone({
      setHeaders: {
        "usersession": userSession,
        "X-Tenant-ID": databaseUsedInRequest,
      },
      withCredentials: true,
    });

    // Resposta obtida após a requisição
    return next.handle(newReq).pipe(
      // Caso ocorreu algum erro
      catchError((error: HttpErrorResponse) => {

        // Caso obter "401 Unauthorized" (status de não autorizado para fazer a requisição) como erro
        if (error instanceof HttpErrorResponse && error.status === 401) {

          if (this.hasTriedToRefresh == false) {
            this.hasTriedToRefresh = true;
            //Tenta obter o token de acesso
            this.authService.refreshAccessToken().pipe(take(1)).subscribe({
              next: (value) => {
                //TODO reload and save user data on localstorage
                location.reload();
              },
              error: (error) => {
                this.hasTriedToRefresh = false;
              },
            });
          } else {

            //Limpa todos os dados armazenados e redireciona o usuário
            localStorage.clear();
            this.router.navigate(['/']);
          }

        }
        return throwError(() => error);

      })
    );
  }
}