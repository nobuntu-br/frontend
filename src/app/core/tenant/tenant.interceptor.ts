import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from './tenant.service';
import { head } from 'lodash';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  /**
   * Constructor
   */
  constructor(private tenantService: TenantService) { }

  /**
   * Intercept
   *
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tenant = sessionStorage.getItem('tenant');
    if (tenant) {
      req = req.clone({
        headers: req.headers.set('X-Tenant', tenant)
      });
    }
    console.log('TenantInterceptor', req.headers);
    return next.handle(req);
  }
}
