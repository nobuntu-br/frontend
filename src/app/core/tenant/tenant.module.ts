import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TenantInterceptor } from './tenant.interceptor';
import { TenantService } from './tenant.service';
import { TenantCredentialsFormComponent } from './tenant-credentials-form/tenant-credentials-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TenantCredentialsRoutingModule } from './tenant-credentials-routing.module';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [TenantCredentialsFormComponent],
  providers: [TenantService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: forwardRef(() => TenantInterceptor),
      multi: true
  },
  ],
  imports: [
    CommonModule,
    TenantCredentialsRoutingModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule
  ]
})
export class TenantModule { }
