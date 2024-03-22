import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, forkJoin, map, shareReplay, take } from 'rxjs';

interface INavListOption {
  routeUrl: string,
  optionName: string,
  svgIcon: string
}

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
  navListOptions : INavListOption[] | null;

  applicationTitle : string = 'NadirDigital'; 
  menuTitle : string = 'Menu';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset) 
  .pipe( 
    map(result => result.matches), 
    shareReplay() 
  ); 

  constructor(private breakpointObserver: BreakpointObserver, private httpClient: HttpClient) {

    this.getDataToMenu("/assets/dicionario/menu.json").then(data => {
      this.navListOptions = data;
    });

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
          let navListOptions : INavListOption[] = [];

          if(('itens' in data) == false) return;

          data.itens.forEach(item => {
            navListOptions.push({optionName: item.name, svgIcon: item.icon, routeUrl: item.routeUrl })
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

