import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { User } from 'oidc-client-ts';
import {
  Observable,
  Subject,
  map,
  shareReplay,
  take,
  takeUntil,
  tap,
} from 'rxjs';

/**
 * Interface que contém informações das opções de vavegação do sideNavBar
 * @param routeUrl Rota que o usuário será levado ao selecionar a opção
 * @param optionName Nome da opção. @example "Product"
 * @param svgIcon Caminho para o icone da opcão. @example "feather:box"
 */
interface INavListOption {
  routeUrl: string;
  optionName: string;
  icon: string;
  optionNameTranslated: string;
  isSubmenu?: boolean;
  subMenu?: INavListOption[];
}

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  selectedView: string = 'card'; // Valor padrão para 'card'

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
  /**
   * Define se pose ser apresentado o botão do logOut (sair do acesso a conta)
   */
  canShowLogOutButton: boolean = false;
  /**
   * Define se o usuário atual pode ter controle para qual Tenant ele usará nas suas operações com a API
   */
  canUserControlTenant: boolean = true;

  private ngUnsubscribe = new Subject<void>();

  currentUser: User;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private httpClient: HttpClient,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('currentUser');
    this.currentUser = userString ? JSON.parse(userString) : [];
    //arrumar o email e a senha do currentUser
    // this.authService.loginCredential("teslaeletronico@gmail.com","adminN123")
    this.route.queryParams.subscribe(async (params) => {
      const userId = params['userId'];
      if (userId) {
        await this.authService.switchUser(userId);
        this.router.navigate(['']);
      }
    });

    this.getDataToMenu(environment.menuPath).then((data) => {
      this.navListOptions = data;
      this.isHandset$ = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
          map((result) => result.matches),
          tap((result) => {
            //Se o resultado for falso (for tela grande)
            if (result == false) {
              //Isso foi adicionado pois devido ao uso do transloco, ele faz ficar sobreposto
              setTimeout(() => {
                this.canCloseNavBar = false; //Não poderá fechar o NavBar
                this.sideNavBarIsOpened = true; //Deixará o NavBarAberto
              }, 1000);
            } else {
              this.canCloseNavBar = true;
              this.sideNavBarIsOpened = false;
            }
          }),
          shareReplay()
        );
    });

    this.showLogOutButton();
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
      this.httpClient
        .get<any>(JSONMenuPath)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            let navListOptions: INavListOption[] = [];
            if ('itens' in data == false) return;

            data.itens.forEach((item) => {
              navListOptions.push({
                optionName: item.name,
                icon: item.icon,
                routeUrl: item.routeUrl,
                optionNameTranslated: item.name,
                isSubmenu: item.subMenu ? true : false,
                subMenu: item.subMenu,
              });
              if (item.subMenu) {
                item.isSubmenu = true;
              }
            });

            resolve(navListOptions);
            3;
          },
          error: (error) => {
            console.warn(error);

            reject(error);
          },
        });
    });
  }

  showLogOutButton() {
    this.authService
      .check()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (isAuthorized: boolean) => {
          this.canShowLogOutButton = isAuthorized;
        },
        error: (error) => {
          this.canShowLogOutButton = false;
        },
      });
  }

  redirectToSignInPage() {
    this.saveRedirectURL(this.router.url);
    this.router.navigate(['signin']);
  }

  private saveRedirectURL(redirectURL: string) {
    localStorage.setItem('redirectURL', redirectURL);
  }
  onViewChange(viewType: string) {
    console.log(viewType);
    this.selectedView = viewType; // Atualiza a exibição com base no botão clicado
  }
  switchAccount(): void {
    // this.authService.switchAccount();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
