import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TenantInterceptor } from './tenant.interceptor';
import { TenantService } from './tenant.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TenantCredentialFormComponent } from './tenant-credential-form/tenant-credential-form.component';
import { IconsModule } from '../icons/icons.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TranslocoRootModule } from 'app/transloco-root.module';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,//Para usar o fromGroup
    //IconsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TranslocoRootModule,
    // TranslocoModule
  ],
  declarations: [TenantCredentialFormComponent],
  providers: [TenantService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: forwardRef(() => TenantInterceptor),
      multi: true
    },
  ]
})
export class TenantModule { }
