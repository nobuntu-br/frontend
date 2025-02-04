import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {
  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private httpClient: HttpClient
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Can match
   *
   * @param route
   * @param segments
   */
  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._check(segments);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @param segments
   * @private
   */
  private _check(segments: UrlSegment[]): Observable<boolean | UrlTree> {
    // Check the authentication status

    return this._authService.check().pipe(

      switchMap((authenticated) => {

        // Se o usuário não estiver autenticado
        if (!authenticated) {

          return this._authService.handleToken().pipe(take(1),
            switchMap((success) => {
              if (success) {
                return of(true);
              }

              return this.redirectToSignIn(segments);
            }),
            catchError(() => {
              return this.redirectToSignIn(segments);
            })
          );

        }

        // Permite o acesso
        return of(true);
      }),
      take(1)
    );
  }

  private saveRedirectURL(redirectURL: string) {
    localStorage.setItem("redirectURL", redirectURL);
  }

  /**
  * Redireciona para a página de login e retorna `of(false)`
  */
  private redirectToSignIn(segments: UrlSegment[]): Observable<boolean> {
    // Redirecionará para pagina de sign-in com um redirectUrl param
    const redirectURL = `/${segments.join('/')}`;
    this.saveRedirectURL(redirectURL);
    //Redireciona o usuário para página de signIn
    this._router.navigate(['signin']);
    return of(false);
  }

  //TODO ao verificar o acesso a página, obter o JSON de contrução de página relacionado a pagina requisitada e a role do usuário
  verifyAcessToPage(segments: UrlSegment[]) {
    //No momento que a pessoa for acessar a rota, preciso ler o JSON do menu e pegar o caminho da API
    this.httpClient.get<any>(environment.menuPath).pipe(take(1)).subscribe({
      next: (data) => {
        const routeobj = data["itens"].find((item) => item.routeUrl === segments.join('/'));

        if (routeobj == null) return;

        const _params = new HttpParams()
          .set('method', "GET")
          .set('apiUrl', "/cartaoConsumo");

        this.httpClient.get<any>(environment.backendUrl + "/api/guard", { params: _params }).subscribe({
          next: (data) => console.log(data),
        })

      }
    })
  }
}
