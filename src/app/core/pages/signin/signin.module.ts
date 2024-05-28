import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [
    SigninComponent,
  ],
  imports: [
    CommonModule,
    SigninRoutingModule,
    TranslocoModule
  ]
})
export class SigninModule { }
