import { Component, OnInit } from '@angular/core';
import { ApplicationService, Application } from 'app/shared/services/application.service';
import { AuthService } from 'app/core/auth/auth.service';
import { UserManager, UserManagerSettings } from 'oidc-client-ts';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

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
    private router: Router
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

  confirmOpenApp(app: Application) {
    this.selectedApp = app;
  }

  async openApp(app: Application) {
    const settings: UserManagerSettings = {
      authority: environment.authority,
      client_id: app.client_id,
      redirect_uri: app.redirect_uri,
      post_logout_redirect_uri: app.post_logout_redirect_uri,
      response_type: 'code',
      scope: app.scope,
      filterProtocolClaims: true,
      loadUserInfo: false,
      extraQueryParams: {
        p: environment.signInPolitical,
      },
    }
    
    this.userManagerParameter = new UserManager(settings);
    this.saveRedirectURL(this.router.url);

    try {
      await this.authService.loginInSpecificApp(this.userManagerParameter);
    } catch (error) {
      console.error('Erro ao redirecionar para o aplicativo:', error);
    }
  }

  private saveRedirectURL(redirectURL: string) {
    localStorage.setItem("redirectURL", redirectURL);
  }

  closeApp() {
    this.selectedApp = null;
  }
}
