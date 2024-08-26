import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { TokenService } from "./token.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private _tokenService: TokenService) {}


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
          // TODO Aqui lida com o caso do token ficar inválido pelo tempo. Deverá ser feito a requição para obter um token de acesso novo. Caso erro, encerrar o acesso do usuário.
          // this._authService.logout();

        if (token && !this._tokenService.isTokenExpired(token)) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
            });
        }

        return next.handle(newReq).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    // Tratar erro 401
                }

                return throwError(error);
            })
        );
    }
}
