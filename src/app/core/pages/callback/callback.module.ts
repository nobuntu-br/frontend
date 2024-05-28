import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallbackRoutingModule } from './callback-routing.module';
import { CallbackComponent } from './callback/callback.component';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [
    CallbackComponent
  ],
  imports: [
    CommonModule,
    CallbackRoutingModule,
    TranslocoModule
  ]
})
export class CallbackModule { }
