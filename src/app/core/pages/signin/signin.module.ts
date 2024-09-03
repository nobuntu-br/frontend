import { NgModule } from '@angular/core';

import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    SigninComponent,
    
  ],
  imports: [
    SigninRoutingModule,
    CommonModule,
    TranslocoModule,
    FormsModule,
  ]
})
export class SigninModule { }
