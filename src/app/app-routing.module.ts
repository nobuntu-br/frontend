import { Route } from '@angular/router'; 
import { AuthGuard } from 'app/core/auth/guards/auth.guard'; 
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'; 
import { SideNavComponent } from './shared/components/side-nav/side-nav.component'; 
import { EditProfileComponent } from './shared/components/edit-profile/edit-profile.component';
import { ResetPasswordComponent } from './shared/components/reset-password/reset-password.component';
import { CreateUserComponent } from './shared/components/create-user/create-user.component'; 
import { SigninComponent } from './core/pages/signin/signin.component';


export const appRoutes: Route[] = [

    // Redirect empty path to '/example' 
    {path: 'signin', pathMatch: 'full', component: SigninComponent}, 

    {path: 'createuser', pathMatch: 'full', component: CreateUserComponent}, 
    {path: 'resetPassword', pathMatch: 'full', component: ResetPasswordComponent}, 
    // Auth routes for guests 
        {path: 'signin', loadChildren: () => import('app/core/pages/signin/signin.module').then(m => m.SigninModule)},
        {path: '404-not-found', loadChildren: () => import('app/core/pages/error/error-404/error-404.module').then(m => m.Error404Module)}, 

                    {path: '500', loadChildren: () => import('app/core/pages/error/error-500/error-500.module').then(m => m.Error500Module)}, 

    // Admin routes 
    { 
        path: '', 
        canMatch: [AuthGuard], 
        component: SideNavComponent, 
        children: [ 
          {path: 'editProfile', pathMatch: 'full', component: EditProfileComponent},  
        //   {path: '**', redirectTo: '/404-not-found'}, 
        ] 
    }, 
]; 
