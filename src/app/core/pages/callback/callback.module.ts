import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallbackRoutingModule } from './callback-routing.module';
import { CallbackComponent } from './callback.component';

//Angular Material Components
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    CallbackComponent
  ],
  imports: [
    CommonModule,
    CallbackRoutingModule,
    //Angular Material Components
    MatProgressSpinnerModule,
  ]
})
export class CallbackModule { }
