import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/auth/user.model';
import { UserService } from 'app/core/auth/user.service';
import { TenantService } from 'app/core/tenant/tenant.service';
import { environment } from 'environments/environment';
import { UserManager } from 'oidc-client-ts';
import { take } from 'rxjs';

enum CallbackPageState {
  Redirecting,
  Error,
}

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  pageState : CallbackPageState;
  private userManager: UserManager;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private tenantService: TenantService,
  ) {
    this.pageState = CallbackPageState.Redirecting;
  }

  async ngOnInit(): Promise<void> {
    await this.authService.completeAuthentication().catch((returnedValue)=>{
      this.pageState = CallbackPageState.Error;
      // console.log(returnedValue);
    });

    const user: User = {
      firstName: this.authService.getUser.name,
      isAdministrator: false,
      lastName: this.authService.getUser.name,
      memberType: "User",
      Roles: [],
      TenantUID: environment.tenant_id,
      UID: this.authService.userUID,
      username: this.authService.getUser.name,
    }

    try {
      //Verificar se usuário está registrado na aplicação
      this.userService.getByUID(this.authService.userUID).pipe(take(1)).subscribe({
        next: async (returnedUser: User) => {
          this.saveUserSessionStorage(returnedUser);
          this.registerNewSession(returnedUser.id);
        },

        error: (_error) => {
          //Se não estiver registrado, registrar
          this.userService.create(user).pipe(take(1)).subscribe({
            next: (newUser: User) => {
              this.registerNewSession(newUser.id);
            },
            error: (error) => {
              //Se não conseguir registrar, deslogar e redirecionar para página de erro
              console.log(error);
              this.authService.logout();
              this.redirectToErrorPage();
            }
          });

        }
      });

    } catch (error) {
      console.log(error);
      this.redirectToErrorPage();
    }
  }

  redirectToPageBeforeSignIn() {
    const redirectURL = window.localStorage.getItem("redirectURL");
    window.localStorage.removeItem("redirectURL");
    if (redirectURL) {
      if(redirectURL == '/signout' || redirectURL == '/signin' || redirectURL == '/callback' || redirectURL == '/404-not-found') {
        this.router.navigate(["/"]);
      } else {
        this.router.navigate([redirectURL]);
      }
    } 
    if (!redirectURL) {
      this.router.navigate(["/"]);
    }
  }

  redirectToErrorPage() {
    this.router.navigate(["/404-not-found"]);
  }

  registerNewSession(userID: string) {
    this.authService.registerNewSession(this.authService.userUID, userID).pipe(take(1)).subscribe({
      next: (data) => { 
        this.redirectToPageBeforeSignIn();
      },
      error: (error) => {
        console.log(error);
        this.authService.logout();
        this.redirectToErrorPage();
      }
    })
  }

  saveUserSessionStorage(user: User) {
      sessionStorage.setItem('user', JSON.stringify(user));
      if(user.tenants) {
        sessionStorage.setItem('tenant', JSON.stringify(user.tenants[0]));
      }
  }
}
