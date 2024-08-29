import { NgModule } from '@angular/core';

import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SigninComponent,
    
  ],
  imports: [
    SigninRoutingModule,
    TranslocoModule,
    FormsModule,
  ]
})
export class SigninModule { }
