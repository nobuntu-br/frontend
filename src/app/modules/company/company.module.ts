import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyFormComponent } from './company-form/company-form.component';
import { ListCompanyComponent } from './list-company/list-company.component';


@NgModule({
  declarations: [
    CompanyFormComponent,
    ListCompanyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule
  ]
})
export class CompanyModule { }
