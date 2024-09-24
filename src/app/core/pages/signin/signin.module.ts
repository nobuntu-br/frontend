import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    SigninComponent,
  ],
  imports: [
    CommonModule,
    SigninRoutingModule,
    TranslocoModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ]
})
export class SigninModule { }
