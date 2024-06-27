import { Component, OnInit } from '@angular/core';
import { ApplicationService, Application } from 'app/shared/services/application.service';
import { AuthService } from 'app/core/auth/auth.service';

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

  constructor(private applicationService: ApplicationService, private authService: AuthService) {}

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
    // Aqui você pode adicionar a lógica para exibir o popup de confirmação antes de abrir o aplicativo
    // Por exemplo: this.showConfirmationPopup = true;
  }

  openApp() {
    // Aqui você pode adicionar a lógica de navegação para o aplicativo selecionado
    // Por exemplo: window.open(this.selectedApp.spaRedirectUris[0], '_blank');
  }

  closeApp() {
    this.selectedApp = null;
  }
}
