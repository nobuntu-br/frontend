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

  async openApp(app: Application) {
    // Redirecionar para o aplicativo com o usuário codificado na URL
      const redirectUrl = `${app.redirect_uri}`;
      // console.log(redirectUrl);
      window.open(redirectUrl, '_blank');
  }

  private saveRedirectURL(redirectURL: string) {
    localStorage.setItem("redirectURL", redirectURL);
  }

  closeApp() {
    this.selectedApp = null;
  }
}
