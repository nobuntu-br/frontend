import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { TenantService } from 'app/core/pages/tenant/tenant.service';
import { DatabaseCredentialService } from 'app/core/pages/tenant/databaseCredential/databaseCredential.service';
import { DatabaseCredential } from 'app/core/pages/tenant/databaseCredential/databaseCredential.model';

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
    private databaseCredentialService: DatabaseCredentialService,
    private _router: Router
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
    // return this._check(segments);
    return this._checkNewVersion(segments);
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

    //Nessa verificaçào não tá esperando as requisições abaixo

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

    //TODO ver quais tenants aparecem, se não tiver nenhum, redirecionar para pagina de criação de tenant

    //Cada tenant pode ter várias credenciais, o que importa é a credencial registrada e não tenant em si

    this.databaseCredentialService.getByTenantId(2).subscribe({
      next: (databaseCredentials: DatabaseCredential[]) => {

        console.log("databaseCredentails do usuário: ", databaseCredentials);

        if(databaseCredentials.length == 0){
          this._router.navigate(['/tenant/add']);
        }
      },
      error: (error) => {
        //TODO fazer um caso de erro
      },
    })

    console.log(this.tenantService.getAnyTenantFromLocalStorage());

    if (this.tenantService.getAnyTenantFromLocalStorage() == null && segments[0].path != "tenant") {
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

  private _checkNewVersion(segments: UrlSegment[]): Promise<boolean | UrlTree> {
    const myPromise: Promise<boolean | UrlTree> = new Promise(async (resolve, reject) => {

      //Se não estiver autenticado, obter o token
      if (this.authService.currentUser == null) {
        this.authService.handleToken().pipe(take(1)).subscribe({
          next: (value) => {
            if (value == false) {
              //Se não conseguir o token ele é jogado fora
              localStorage.clear();
              return this.redirectToSignIn(segments);
            }
          },
          error: (error) => {
            reject(false);
          },

        });
      }

      //TODO obter o ID dos tenants que o usuário tem acesso
      // await this.tenantService.getTenantsAndSaveInLocalStorage(user.UID);
      

      //TODO ver quais tenants aparecem, se não tiver nenhum, redirecionar para pagina de criação de tenant
      this.databaseCredentialService.getByTenantId(2).pipe(take(1)).subscribe({
        next: (databaseCredentials: DatabaseCredential[]) => {
          if(databaseCredentials.length == 0){
            this._router.navigate(['/tenant/add']);
          }
        },
        error: (error) => {
          reject(false);
        },
      });

      resolve(true);

    });

    return myPromise;
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
