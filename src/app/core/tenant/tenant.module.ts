import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TenantInterceptor } from './tenant.interceptor';
import { TenantService } from './tenant.service';



@NgModule({
  declarations: [],
  providers: [TenantService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TenantInterceptor,
      multi: true
  },
  ],
  imports: [
    CommonModule
  ]
})
export class TenantModule { }
