import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Observable, map, shareReplay, take, tap } from 'rxjs';

/**
 * Interface que contém informações das opções de vavegação do sideNavBar
 * @param routeUrl Rota que o usuário será levado ao selecionar a opção
 * @param optionName Nome da opção. @example "Product"
 * @param svgIcon Caminho para o icone da opcão. @example "feather:box"
 */
interface INavListOption {
  routeUrl: string,
  optionName: string,
  svgIcon: string,
  optionNameTranslated: string
}

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  /**
   * Opções que são apresentadas na lista lateral para navegar para outras paginas da aplicação
   */
  navListOptions: INavListOption[] | null;
  /**
   * Título que será apresentada no cabeçário da aplicação.
   */
  applicationTitle: string = environment.applicationTitle;
  /**
   * Texto que aparecerá no topo da navegador lateral.
   */
  menuTitle: string = 'Menu';

  isHandset$: Observable<boolean>;
  /**
   * Define se o sideNavBat (navegador lateral) está aberto ou não,
   */
  sideNavBarIsOpened: boolean = false;
  /**
   * Define se é permitido fechar a sideNavBar (navegador lateral).
   */
  canCloseNavBar: boolean = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private httpClient: HttpClient,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getDataToMenu(environment.menuPath).then(data => {
      this.navListOptions = data;
      
      this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
          map(result => result.matches),
          tap(result => {
            //Se o resultado for falso (for tela grande)
            if (result == false) {
              //Isso foi adicionado pois devido ao uso do transloco, ele faz ficar sobreposto
              setTimeout(() => {
                this.canCloseNavBar = false;//Não poderá fechar o NavBar
                this.sideNavBarIsOpened = true;//Deixará o NavBarAberto
              }, 1000);
             
            } else {
              this.canCloseNavBar = true;
              this.sideNavBarIsOpened = false;
            }
          }),
          shareReplay()
        );

    });
  }

  showSideNavBar() {
    this.sideNavBarIsOpened = true;
  }

  closeSideNavBar() {
    if (this.canCloseNavBar == true) {
      this.sideNavBarIsOpened = false;
    }
  }

  /**
   * Obtem dados do JSON para contrução do menu de navegação da aplicação
   * @param JSONMenuPath Caminho onde se encontra o JSON que irá obter as informações para contrução do menu de navegação. @example "/assets/dicionario/menu.json"
   * @returns Retorna um array com informações para criar o menu de navegação.
   */
  getDataToMenu(JSONMenuPath: string): Promise<INavListOption[]> {

    return new Promise<INavListOption[]>((resolve, reject) => {

      this.httpClient.get<any>(JSONMenuPath).pipe(take(1)).subscribe({
        next: (data) => {
          let navListOptions: INavListOption[] = [];

          if (('itens' in data) == false) return;

          data.itens.forEach(item => {
            navListOptions.push({ optionName: item.name, svgIcon: item.icon, routeUrl: item.routeUrl, optionNameTranslated: item.name })
          });

          resolve(navListOptions);

        },
        error: (error) => {
          console.warn(error);

          reject(error);
        }
      });

    });

  }

}

