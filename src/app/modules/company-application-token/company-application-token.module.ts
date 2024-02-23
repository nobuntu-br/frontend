import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyApplicationTokenRoutingModule } from './company-application-token-routing.module';
import { CompanyApplicationTokenFormComponent } from './company-application-token-form/company-application-token-form.component';
import { ListCompanyApplicationTokenComponent } from './list-company-application-token/list-company-application-token.component';


@NgModule({
  declarations: [
    CompanyApplicationTokenFormComponent,
    ListCompanyApplicationTokenComponent
  ],
  imports: [
    CommonModule,
    CompanyApplicationTokenRoutingModule
  ]
})
export class CompanyApplicationTokenModule { }
