import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TenantService } from 'app/core/pages/tenant/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {
  /**
   * Constructor
   */
  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
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

    if (this.authService.currentUser == null) {
      this.authService.handleToken().pipe(take(1)).subscribe({
        next: (value) => {

          if (value == true) {

            // Permite o acesso a pagina
            // return of(true);

          } else {
            //Se não conseguir o token ele é jogado fora
            localStorage.clear();
            return this.redirectToSignIn(segments);
          }

        },
      });
    }
    
    // Verificar se o usuário tem algum tenant para acessar. Se não tiver ele é direcionado para criação de tenant
    if(this.tenantService.getAnyTenantFromLocalStorage() == null && segments[0].path != "tenant"){
      this._router.navigate(['/tenant/add']);
    }

    // return of(false);
    return of(true);

    //Verificar se a pessoa tem acesso a rota pela API

    /*
    return this.authService.check().pipe(

      switchMap((authenticated) => {

        // Se o usuário não estiver autenticado
        if (!authenticated) {

          
          //Tenta obter o token de acesso
          this.authService.handleToken().pipe(take(1)).subscribe({
            next: (value) => {

              if (value == true) {

                // Permite o acesso a pagina
                return of(true);

              } else {
                //Se não conseguir o token ele é jogado fora
                localStorage.clear();
                return this.redirectToSignIn(segments);
              }

            },
          });

        }

        // Permite o acesso
        return of(true);
      }),
      take(1)
    );
    */
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


}
