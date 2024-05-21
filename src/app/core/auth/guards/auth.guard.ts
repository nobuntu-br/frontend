import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { options } from 'app/app.module';

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

        console.log("Usuário com permisão para rota? ", authenticated);
        // Se o usuário não estiver autenticado
        if (!authenticated) {

          // Redirecionará para pagina de sign-in com um redirectUrl param
          const redirectURL = `/${segments.join('/')}`;
          // const urlTree = this._router.parseUrl(`sign-in?redirectURL=${redirectURL}`);

          this.saveRedirectURL(redirectURL);

          // //Redireciona o usuário para pagina de singIn da Azure
          // this._authService.signIn(redirectURL);
          // const urlTree = this._router.parseUrl(`sign-in`);
          this._router.navigate(['signin']);
          
          return of(false);
          // return of(urlTree);
        }
        // this.verifyAcessToPage(segments);
        
        // Permite o acesso
        return of(true);
      })
    );
  }

  private saveRedirectURL(redirectURL: string) {
    localStorage.setItem("redirectURL", redirectURL);
  }

  //TODO ao verificar o acesso a página, obter o JSON de contrução de página relacionado a pagina requisitada e a role do usuário
  verifyAcessToPage(segments: UrlSegment[]){
    //No momento que a pessoa for acessar a rota, preciso ler o JSON do menu e pegar o caminho da API
    this.httpClient.get<any>(environment.menuPath).pipe(take(1)).subscribe({
      next: (data) => {
        const routeobj = data["itens"].find((item) => item.routeUrl === segments.join('/'));

        if (routeobj == null) return;

        const _params = new HttpParams()
        .set('method', "GET")
        .set('apiUrl', "/cartaoConsumo");

        this.httpClient.get<any>(environment.backendUrl + "/api/guard", {params : _params}).subscribe({
          next: (data) => console.log(data),
        })

      }
    })
  }
}
