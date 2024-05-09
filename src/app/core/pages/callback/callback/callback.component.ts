import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { User } from 'app/core/auth/user.model';
import { UserService } from 'app/core/auth/user.service';
import { LocalStorageService } from 'app/shared/services/local-storage.service';
import { environment } from 'environments/environment';
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
    private router: Router,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    // TODO VAI pegar dos params os valores obtidos da autenticação
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {

      var authorizationResponse = {
        code: params['code'],
        state: params['state'],
      };


      if (!params.hasOwnProperty("code")) {
        this.router.navigate(["404-not-found"]);
        return;
      };

      var access_data;

      //Obter o accessToken
      this.authService.getAccessToken(authorizationResponse.code).pipe(take(1)).subscribe({
        next: async (returnedData) => {

          access_data = returnedData;
          this.authService._authenticated = true;
          this.authService.setAccessToken(access_data["access_token"]);
          this.authService.refreshToken = access_data["refresh_token"];

          const decodedAccessToken: object = AuthUtils._decodeToken(this.authService.accessToken);
          console.log("Dados do accessToken decodificado: ", decodedAccessToken);
          const userUID = decodedAccessToken["oid"];

          const user: User = {
            firstName: decodedAccessToken["name"],
            isAdministrator: false,
            lastName: decodedAccessToken["given_name"],
            memberType: "User",
            Roles: [],
            TenantUID: environment.providerUriB2C,
            UID: userUID,
            username: decodedAccessToken["name"],
          }

          //Verifica se o usuário está cadastrado
          this.userService.getByUID(userUID).pipe(take(1)).subscribe({
            next: (returnedUser) => {
              this.registerNewSession(userUID, returnedUser.id);  
            },
            error: (_error) => {
              // user = this.createNewUser(user);
              this.userService.create(user).pipe(take(1)).subscribe({
                next:(newUser)=>{
                  console.log("Usuário criado com sucesso!");
                  this.registerNewSession(userUID, newUser.id);
                },
                error: (error) => {
                  console.warn("Erro ao criar o usuário ", error);
                  this.redirectToErrorPage();
                }
              })
            }
          });

          

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

  redirectToErrorPage() {
    this.router.navigate(["/404-not-found"]);
  }

  createNewUser(user: User){
    console.log("Usuário que será criado: ", user)
    this.userService.create(user).pipe(take(1)).subscribe({
      next: (data) => {
        console.log("Usuário criado com sucesso!", data);
        this.redirectToPageBeforeSignIn();
      },
      error: (error) => {
        console.warn("Erro na criação do usuário: ", error);
      }
    })
  }

  registerNewSession(userUID: string, userId: string){
    this.authService.registerNewSession(userUID, userId).pipe(take(1)).subscribe({
      next: (createdSession: object) => {
        console.log("Sessão criada com sucesso ", createdSession);
        this.redirectToPageBeforeSignIn();
      },
      error: (error) => {
        this.redirectToErrorPage();
      }
    });
  }

}
