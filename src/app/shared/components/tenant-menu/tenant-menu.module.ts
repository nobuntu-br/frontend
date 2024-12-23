import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { TenantMenuComponent } from './tenant-menu.component';

//Angular Material Modules
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    TenantMenuComponent
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    //Angular Material Modules
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule
  ],
  exports: [
    //Define para que o componente possa ser importado por outros módulos
    TenantMenuComponent
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: { scope: "components", alias: "componentsBase" } }
  ],
})
export class TenantMenuModule { }
