import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';

//Angular material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

//Transloco
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { ConfigurationMenuComponent } from './configuration-menu/configuration-menu.component';

@NgModule({
  declarations: [
    ConfigurationMenuComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    //Transoloco
    TranslocoModule,
    //Angular Material
    MatFormFieldModule,
    MatButtonModule,
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: { scope: "core", alias: "core" } }
  ],
})
export class ConfigurationModule { }
