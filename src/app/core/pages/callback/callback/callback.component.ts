import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserModel } from 'app/core/auth/user.model';
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
    private route: ActivatedRoute,
    private userService: UserService,
    private tenantService: TenantService,
  ) {}

  async ngOnInit(): Promise<void> {
    // Verificar se o localstorage tem informação da autheticacao realizada no outro aplicativo


    // Se ele for registrar nova sessao


    // verificar se o usuario que esta entrando tem acesso a aplicacao se ele tiver acesso deixa
    // usar e redirecionar para o barra

    // const userParam = this.route.snapshot.queryParamMap.get('user');
    // console.log(userParam)
    // if (userParam) {
    //     // Decodificar o usuário da URL e converter de volta para JSON
    //     const userString = atob(decodeURIComponent(userParam)); // Converte de base64
    //     const user = JSON.parse(userString);
    //     console.log(user);

    //     // Usar o objeto do usuário para autenticar no aplicativo de destino
    //     await this.authService.authenticateWithUser(user);

    //     // Utilize o perfil para inicializar ou criar o usuário
    //     // Por exemplo: this.userService.createUserProfile(user.profile);

    //     this.router.navigate(['/']);
    // }
    // try {
    //   await this.completeAuthentication();
    //   const user = this.createUserObject();

    //   this.userService.getByUID(this.authService.userUID).pipe(take(1)).subscribe({
    //     next: async (returnedUser: UserModel) => {
    //       this.saveUserSessionStorage(returnedUser);
    //       this.registerNewSession(returnedUser.id);
    //     },
    //     error: () => {
    //       this.registerNewUser(user);
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    //   this.redirectToErrorPage();
    // }







    // try {
    //   await this.completeAuthentication();
    //   const user = this.createUserObject();
    //   console.log("Estou passando por aqui")
    //   this.userService.getByUID(this.authService.userUID).pipe(take(1)).subscribe({
    //     next: async (returnedUser: UserModel) => {
    //       this.saveUserSessionStorage(returnedUser);
    //       this.registerNewSession(returnedUser);
    //     },
    //     error: () => {
    //       this.registerNewUser(user);
    //     }
    //   });
    // } catch (error) {
    //   console.log("Estou passando pelo catch porcausa do erro: ", error)
    //   this.route.paramMap.subscribe(async params => {
    //     const encodedUser = params.get('user');
    //     if (encodedUser) {
    //       const decodedUserOID = this.base64Decode(encodedUser).trim().replace(/"/g, ''); // Remove as aspas usando replace()
    //       console.log('Decoded UserModel:', decodedUserOID); 
    //   try {
    //     await this.authService.login();
        
    //     this.userService.getByUID(decodedUserOID).pipe(take(1)).subscribe({
    //       next: async (returnedUser: UserModel) => {
    //         console.log("Estou aqui no Get Uid user decoded")
    //         returnedUser.username="AAA"
    //         this.saveUserSessionStorage(returnedUser);
    //         this.registerNewSession(returnedUser);
    //       },
    //       error: () => {
    //       }
    //     });
    //   } catch (error) {
        
    //     console.log(error);
    //     this.redirectToErrorPage();
    //   }
    // }
    // });
    // }



    this.authService.completeAuthentication().then(() => {
      // Redirecionar para a página desejada após o login
      this.router.navigate(['/']);
    }).catch(error => {
      console.error('Error completing login', error);
      this.authService.login();

      // Tratar erros, se necessário
    });
  }

  async completeAuthentication(): Promise<void> {
    try {
      await this.authService.completeAuthentication();
    } catch (error) {
      this.pageState = CallbackPageState.Error;
      throw error;
    }
  }

  createUserObject(): UserModel {
    return {
      firstName: this.authService.getUser.name,
      isAdministrator: false,
      lastName: this.authService.getUser.name,
      memberType: "UserModel",
      Roles: [],
      TenantUID: environment.tenant_id,
      UID: this.authService.userUID,
      username: this.authService.getUser.name,
    };
  }

  registerNewUser(user: UserModel): void {
    this.userService.create(user).pipe(take(1)).subscribe({
      next: (newUser: UserModel) => {
        this.registerNewSession(newUser);
      },
      error: (error) => {
        console.log(error);
        this.authService.logout();
        this.redirectToErrorPage();
      }
    });
  }

  registerNewSession(user: UserModel): void {
    console.log("UID:",user.id);
  console.log("ID:" ,user.UID)
    this.authService.registerNewSession(user.UID, user.id).pipe(take(1)).subscribe({
      next: () => {
        this.redirectToPageBeforeSignIn();
      },
      error: (error) => {
        console.log(error);
        // this.authService.logout();
        this.redirectToErrorPage();
      }
    });
  }

  saveUserSessionStorage(user: UserModel): void {
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
   // Função para decodificar base64
   base64Decode(encoded: string): string {
    try {
      return decodeURIComponent(escape(atob(encoded)));
    } catch (e) {
      console.error('Invalid base64 string', e);
      return null;
    }
  }
}
