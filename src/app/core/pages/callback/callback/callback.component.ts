import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { LocalStorageService } from 'app/shared/services/local-storage.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    // TODO VAI pegar dos params os valores obtidos da autenticação
    this.activatedRoute.queryParams.subscribe((params) => {

      var authorizationResponse = {
        code: params['code'],
        state: params['state'],
      };

      if (authorizationResponse.code == null) return;

      var access_data;

      this.authService.getAccessToken(authorizationResponse.code).pipe(take(1)).subscribe({
        next: (returnedData) => {

          access_data = returnedData;
          this.authService._authenticated = true;
          this.authService.setAccessToken(access_data["access_token"]);
          this.authService.refreshToken = access_data["refresh_token"];
          
          // TODO Cadastras a sessão
          // Store the user on the user service
          // this._userService.user = response.user;

          this.redirectToPageBeforeSignIn();

        },
        error: (error) => { }
      });

      

    });
  }

  showAccessToken() {
    console.log("O token de acesso é : " + this.authService.accessToken);
  }

  redirectToPageBeforeSignIn() {
    const redirectURL = window.localStorage.getItem("redirectURL");
    window.localStorage.removeItem("redirectURL");
    if (redirectURL) {
      this.router.navigate([redirectURL]);
    }
  }
}
