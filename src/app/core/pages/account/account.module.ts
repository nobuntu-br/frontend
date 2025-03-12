import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';

//Angular material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

//Transloco
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TranslocoRootModule } from 'app/transloco-root.module';
import { AccountManagementComponent } from './account-management/account-management.component';

@NgModule({
  declarations: [
    AccountManagementComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    //Angular Material
    MatFormFieldModule,
    MatButtonModule,
    //Transoloco
    TranslocoRootModule
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: { scope: "core", alias: "core" } }
  ],
})
export class AccountModule { }
