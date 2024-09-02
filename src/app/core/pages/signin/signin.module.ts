import { NgModule } from '@angular/core';

import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { CalculatorComponent } from 'app/shared/components/calculator/calculator.component';
import { DefaultListComponent } from 'app/shared/components/default-list/default-list.component';
import { DinamicBaseResourceFormComponent } from 'app/shared/components/dinamic-base-resource-form/dinamic-base-resource-form.component';
import { BaseResourceFilterComponent } from 'app/shared/components/filter/base-resource-filter/base-resource-filter.component';
import { GeneratedSimpleFormComponent } from 'app/shared/components/generated-simple-form/generated-simple-form.component';
import { GeneratedStepperFormComponent } from 'app/shared/components/generated-stepper-form/generated-stepper-form.component';
import { InputFieldComponent } from 'app/shared/components/input-field/input-field.component';
import { LanguagesComponent } from 'app/shared/components/languages/languages.component';

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
