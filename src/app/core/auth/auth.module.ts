import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';

import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
// import { OAuthModule } from 'angular-oauth2-oidc';
@NgModule({
    imports: [
        // OAuthModule.forRoot(),
    ],
    providers: [
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
    ]
})
export class AuthModule {
}
