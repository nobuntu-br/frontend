import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

interface INavListOption {
  routerLink: string,
  optionName: string
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

  constructor(private breakpointObserver: BreakpointObserver) {
    this.navListOptions = [{routerLink: 'itens', optionName: 'Itens'}, {routerLink: 'parceiros', optionName: 'parceiros'}, {routerLink:'company', optionName:'company'}]
  } 
}
