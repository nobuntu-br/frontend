import { Component, OnInit } from '@angular/core';
import { ApplicationService, Application } from 'app/shared/services/application.service';
import { AuthService } from 'app/core/auth/auth.service';
import { UserManager, UserManagerSettings } from 'oidc-client-ts';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit {
  customData: any = null;
  showAppMenu: boolean = false;
  selectedApp: Application | null = null;
  apps: Application[] = [];
  private userManagerParameter: UserManager;

  constructor(
    private applicationService: ApplicationService, 
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.login();
    } else {
      this.fetchApps();
    }
  }

  toggleAppMenu() {
    this.showAppMenu = !this.showAppMenu;
  }

  fetchApps() {
    this.applicationService.getApplications().subscribe(
      (response: Application[]) => {
        this.apps = response;
      },
      error => {
        console.error('Erro ao buscar aplicativos:', error);
      }
    );
  }

<<<<<<< HEAD
=======
 

>>>>>>> develop
  async openApp(app: Application) {
    // const settings: UserManagerSettings = {
    //   authority: environment.authority,
    //   client_id: app.client_id,
    //   redirect_uri: app.redirect_uri,
    //   post_logout_redirect_uri: app.post_logout_redirect_uri,
    //   response_type: 'code',
    //   scope: app.scope,
    //   filterProtocolClaims: true,
    //   loadUserInfo: false,
    //   extraQueryParams: {
    //     p: environment.signInPolitical,
    //   },
    // }
    
    // this.userManagerParameter = new UserManager(settings);
    // this.saveRedirectURL(this.router.url);

    // try {
    //   await this.authService.loginInSpecificApp(this.userManagerParameter);
    // } catch (error) {
    //   console.error('Erro ao redirecionar para o aplicativo:', error);
    // }

    const user = this.authService.getUser();
    if (user) {
      // Serializar o usuário como JSON e codificar em base64

      const userString = JSON.stringify(user.profile.oid);
      const userEncoded = btoa(userString); // Converte para base64
      
      // Redirecionar para o aplicativo com o usuário codificado na URL
      const redirectUrl = `${app.redirect_uri}/${encodeURIComponent(userEncoded)}`;
      console.log(redirectUrl);
      window.open(redirectUrl, '_blank');

    } else {
      this.authService.login();
    }
  }

  private saveRedirectURL(redirectURL: string) {
    localStorage.setItem("redirectURL", redirectURL);
  }

  closeApp() {
    this.selectedApp = null;
  }
}
