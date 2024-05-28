import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Constructor
   */
  constructor(private _authService: AuthService)
  {
  }

  /**
   * Intercept
   *
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request object
    let newReq = req.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.

    if ( this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken) )
    {
        newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
        });
    }

    // Resposta obtida após a requisição
    return next.handle(newReq).pipe(
      // Caso ocorreu algum erro
      catchError((error) => {

        // Caso obter "401 Unauthorized" (status de não autorizado para fazer a requisição) como erro
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // TODO Decidir como tratar casos que o usuário não tem autorização para fazer a requisição na API
          // this._authService.logout();

          // Recarregar página
          // location.reload();
        }

        return throwError(error);
      })
    );
  }
}
