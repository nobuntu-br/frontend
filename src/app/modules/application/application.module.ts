import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { ListApplicationComponent } from './list-application/list-application.component';


@NgModule({
  declarations: [
    ApplicationFormComponent,
    ListApplicationComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule
  ]
})
export class ApplicationModule { }
