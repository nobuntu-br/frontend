import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { SideNavComponent } from './shared/components/side-nav/side-nav.component';
import { DefaultDashboardComponent } from './shared/components/default-dashboard/default-dashboard.component';
import { RedirectIfAuthenticatedGuard } from './core/auth/guards/redirect-if-authenticated.guard';

export const appRoutes: Route[] = [

    { path: '', pathMatch: 'full', canActivate: [RedirectIfAuthenticatedGuard], loadChildren: () => import('app/core/pages/home-page/home-page.module').then(m => m.HomePageModule) },
    { path: 'signin', loadChildren: () => import('app/core/pages/signin/signin.module').then(m => m.SigninModule) },
    { path: 'signup', loadChildren: () => import('app/core/pages/signup/signup.module').then(m => m.SignupModule) },
    { path: 'resetPassword', loadChildren: () => import('app/core/pages/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
    { path: 'error-404', loadChildren: () => import('app/core/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
    { path: 'error-500', loadChildren: () => import('app/core/pages/error/error-500/error-500.module').then(m => m.Error500Module) },
    { path: 'callback',  loadChildren: () => import('app/core/pages/callback/callback.module').then(m => m.CallbackModule) },
    { path: 'home', canMatch: [AuthGuard], component: SideNavComponent },
    { path: 'dashboard/:id', component: DefaultDashboardComponent },      
    {
        path: 'tenant',
        canMatch: [AuthGuard],
        component: SideNavComponent,
        children: [
            { path: '', loadChildren: () => import('app/core/pages/tenant/tenant.module').then(m => m.TenantModule) },
        ]   
    },
    {
        path: 'account',
        canMatch: [AuthGuard],
        component: SideNavComponent,
        children: [
            { path: '', loadChildren: () => import('app/core/pages/account/account.module').then(m => m.AccountModule) },
        ]   
    },
    {
        path: 'configuration',
        canMatch: [AuthGuard],
        component: SideNavComponent,
        children: [
            { path: '', loadChildren: () => import('app/core/pages/configuration/configuration.module').then(m => m.ConfigurationModule) },
        ]   
    },

    { path: '**', loadChildren: () => import('app/core/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
]; 
