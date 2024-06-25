import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit {
  apps: any[] = [];
  showAppMenu: boolean = false;
  selectedApp: any = null;

  constructor() {}

  ngOnInit(): void {
    this.fetchApps(); // Carrega os aplicativos fictícios na inicialização
  }

  toggleAppMenu() {
    this.showAppMenu = !this.showAppMenu;
  }

  fetchApps() {
    // Use dados fictícios para simular aplicativos, incluindo ícones
    this.apps = [
      { displayName: 'Mail', content: 'Conteúdo do Mail', icon: 'mail' },
      { displayName: 'Drive', content: 'Conteúdo do Drive', icon: 'cloud' },
      { displayName: 'Planilhas', content: 'Conteúdo das Planilhas', icon: 'insert_chart' },
      { displayName: 'Documentos', content: 'Conteúdo dos Documentos', icon: 'description' },
      { displayName: 'Calendário', content: 'Conteúdo do Calendário', icon: 'calendar_today' }
    ];
  }

  openApp(app: any) {
    this.selectedApp = app;
    this.showAppMenu = false; // Fecha o menu de aplicativos ao selecionar um
  }

  closeApp() {
    this.selectedApp = null; // Fecha o aplicativo atual
  }
}