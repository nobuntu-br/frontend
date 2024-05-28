import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/auth/user.model';
import { UserService } from 'app/core/auth/user.service';
import { environment } from 'environments/environment';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) {
    this.pageState = CallbackPageState.Redirecting;
  }

  async ngOnInit(): Promise<void> {
    await this.authService.completeAuthentication().catch((returnedValue)=>{
      this.pageState = CallbackPageState.Error;
      console.log(returnedValue);
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
        next: (returnedUser: User) => {
          this.registerNewSession(returnedUser.id);
        },

        error: (_error) => {

          this.userService.create(user).pipe(take(1)).subscribe({
            next: (newUser: User) => {
              this.registerNewSession(newUser.id);
            },
            error: (error) => {
              // console.warn("Erro ao criar o usuário ", error);
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
      this.router.navigate([redirectURL]);
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
        this.redirectToErrorPage();
      }
    })
  }

}
