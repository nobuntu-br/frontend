import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/auth/user.model';
import { UserService } from 'app/core/auth/user.service';
import { TenantService } from 'app/core/tenant/tenant.service';
import { environment } from 'environments/environment';
import { UserManager } from 'oidc-client-ts';
import { take } from 'rxjs/operators';

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
  pageState: CallbackPageState = CallbackPageState.Redirecting;
  private userManager: UserManager;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private tenantService: TenantService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.completeAuthentication();
      const user = this.createUserObject();

      this.userService.getByUID(this.authService.userUID).pipe(take(1)).subscribe({
        next: async (returnedUser: User) => {
          this.saveUserSessionStorage(returnedUser);
          this.registerNewSession(returnedUser.id);
        },
        error: () => {
          this.registerNewUser(user);
        }
      });
    } catch (error) {
      console.log(error);
      this.redirectToErrorPage();
    }
  }

  async completeAuthentication(): Promise<void> {
    try {
      await this.authService.completeAuthentication();
    } catch (error) {
      this.pageState = CallbackPageState.Error;
      throw error;
    }
  }

  createUserObject(): User {
    return {
      firstName: this.authService.getUser.name,
      isAdministrator: false,
      lastName: this.authService.getUser.name,
      memberType: "User",
      Roles: [],
      TenantUID: environment.tenant_id,
      UID: this.authService.userUID,
      username: this.authService.getUser.name,
    };
  }

  registerNewUser(user: User): void {
    this.userService.create(user).pipe(take(1)).subscribe({
      next: (newUser: User) => {
        this.registerNewSession(newUser.id);
      },
      error: (error) => {
        console.log(error);
        this.authService.logout();
        this.redirectToErrorPage();
      }
    });
  }

  registerNewSession(userID: string): void {
    this.authService.registerNewSession(this.authService.userUID, userID).pipe(take(1)).subscribe({
      next: () => {
        this.redirectToPageBeforeSignIn();
      },
      error: (error) => {
        console.log(error);
        this.authService.logout();
        this.redirectToErrorPage();
      }
    });
  }

  saveUserSessionStorage(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    if (user.tenants) {
      sessionStorage.setItem('tenant', JSON.stringify(user.tenants[0]));
    }
  }

  redirectToPageBeforeSignIn(): void {
    const redirectURL = window.localStorage.getItem("redirectURL");
    window.localStorage.removeItem("redirectURL");
    console.log("verificar o redirectURL", redirectURL)
    if (redirectURL) {
      if (['/signout', '/signin', '/callback', '/404-not-found'].includes(redirectURL)) {
        console.log("Entrando no primerio e segundo if", redirectURL)
        this.router.navigate(["/"]);
      } else {
        this.router.navigate([redirectURL]);
        console.log("Entrando na exceção ", redirectURL)
      }
    } else {
      this.router.navigate(["/"]);
    }
  }

  redirectToErrorPage(): void {
    this.router.navigate(["/404-not-found"]);
  }
}
