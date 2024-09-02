import { forwardRef, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';

import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { TokenService } from './token.service';
// import { OAuthModule } from 'angular-oauth2-oidc';
@NgModule({
    imports: [
        // OAuthModule.forRoot(),
    ],
    providers: [
        AuthService,
        TokenService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: forwardRef(() => AuthInterceptor),
            multi: true
        },
    ]
})
export class AuthModule {
}
