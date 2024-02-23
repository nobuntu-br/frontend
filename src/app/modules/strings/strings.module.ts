import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StringsRoutingModule } from './strings-routing.module';
import { StringsFormComponent } from './strings-form/strings-form.component';
import { ListStringsComponent } from './list-strings/list-strings.component';


@NgModule({
  declarations: [
    StringsFormComponent,
    ListStringsComponent
  ],
  imports: [
    CommonModule,
    StringsRoutingModule
  ]
})
export class StringsModule { }
