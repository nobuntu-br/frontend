import { Route } from '@angular/router'; 
import { AuthGuard } from 'app/core/auth/guards/auth.guard'; 
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'; 
import { SideNavComponent } from './shared/components/side-nav/side-nav.component'; 


export const appRoutes: Route[] = [ 

    // Redirect empty path to '/example' 
    {path: '', component: SideNavComponent}, 


    // Admin routes 
    { 
        path: '', 
        canMatch: [NoAuthGuard], 
        component: SideNavComponent, 
        children: [ 
	{ path: 'cust', loadChildren: () => import('./modules/customers/customers.module' ).then(m => m.CustomersModule) },
        ] 
    }, 
]; 
