import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    private _authService: AuthService;


  /**
   * Intercept
   *
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }    

    return from(this._authService.handleTokenExpiration()).pipe(
      switchMap(() => {
        // Clone the request object
        let newReq = req.clone();

        // Se o token não expirou, adiciona o cabeçalho Authorization
        if (this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken)) {
          newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
          });
        }

        // Manipula a requisição e captura os erros
        return next.handle(newReq).pipe(
          catchError((error) => {
            // Se o status for 401 Unauthorized, faça o tratamento necessário
            if (error instanceof HttpErrorResponse && error.status === 401) {
              // TODO: Decidir como tratar casos de 401 Unauthorized
              // Exemplo: this._authService.logout();
              // location.reload();
            }

            return throwError(error);
          })
        );
      })
    );
}
}
