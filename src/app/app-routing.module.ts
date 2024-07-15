import { Route } from '@angular/router'; 
import { AuthGuard } from 'app/core/auth/guards/auth.guard'; 
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'; 
import { SideNavComponent } from './shared/components/side-nav/side-nav.component'; 


export const appRoutes: Route[] = [ 

    // Redirect empty path to '/example' 
    {path: '', pathMatch: 'full', component: SideNavComponent}, 

    // Auth routes for guests 
    { 
        path: '', 
        canMatch: [NoAuthGuard], 
        component: SideNavComponent, 
        children: [ 
            {path: 'signin', loadChildren: () => import('app/core/pages/signin/signin.module').then(m => m.SigninModule)}, 
        ] 
    }, 

        {path: '404-not-found', loadChildren: () => import('app/core/pages/error/error-404/error-404.module').then(m => m.Error404Module)}, 

                    {path: '500', loadChildren: () => import('app/core/pages/error/error-500/error-500.module').then(m => m.Error500Module)}, 
            {path: 'callback', loadChildren: () => import('app/core/pages/callback/callback.module').then(m => m.CallbackModule)}, 
			{path: 'callback/:user',loadChildren: () => import('app/core/pages/callback/callback.module').then(m => m.CallbackModule)}, 
    // Admin routes 
    { 
        path: '', 
        canMatch: [AuthGuard], 
        component: SideNavComponent, 
        children: [ 
	{ path: 'customers', loadChildren: () => import('./modules/customers/customers.module' ).then(m => m.CustomersModule) },
	{ path: 'employees ', loadChildren: () => import('./modules/employees/employees.module' ).then(m => m.EmployeesModule) },
	{ path: 'inventoryTransactionTypes  ', loadChildren: () => import('./modules/inventory-transaction-types/inventory-transaction-types.module' ).then(m => m.InventoryTransactionTypesModule) },
	{ path: 'inventoryTransaction', loadChildren: () => import('./modules/inventory-transactions/inventory-transactions.module' ).then(m => m.InventoryTransactionsModule) },
	{ path: 'invoices', loadChildren: () => import('./modules/invoices/invoices.module' ).then(m => m.InvoicesModule) },
	{ path: 'orderDetails', loadChildren: () => import('./modules/order-details/order-details.module' ).then(m => m.OrderDetailsModule) },
	{ path: 'orderDetailsStatus', loadChildren: () => import('./modules/order-details-status/order-details-status.module' ).then(m => m.OrderDetailsStatusModule) },
	{ path: 'orders', loadChildren: () => import('./modules/orders/orders.module' ).then(m => m.OrdersModule) },
	{ path: 'ordersStatus', loadChildren: () => import('./modules/orders-status/orders-status.module' ).then(m => m.OrdersStatusModule) },
	{ path: 'ordersTaxStatus', loadChildren: () => import('./modules/orders-tax-status/orders-tax-status.module' ).then(m => m.OrdersTaxStatusModule) },
	{ path: 'salesReports', loadChildren: () => import('./modules/sales-reports/sales-reports.module' ).then(m => m.SalesReportsModule) },
	{ path: 'shippers', loadChildren: () => import('./modules/shippers/shippers.module' ).then(m => m.ShippersModule) },
	{ path: 'products', loadChildren: () => import('./modules/products/products.module' ).then(m => m.ProductsModule) },
	{ path: 'purchaseOrderDetails', loadChildren: () => import('./modules/purchase-order-details/purchase-order-details.module' ).then(m => m.PurchaseOrderDetailsModule) },
	{ path: 'purchaseOrderStatus', loadChildren: () => import('./modules/purchase-order-status/purchase-order-status.module' ).then(m => m.PurchaseOrderStatusModule) },
	{ path: 'purchaseOrders', loadChildren: () => import('./modules/purchase-orders/purchase-orders.module' ).then(m => m.PurchaseOrdersModule) },
	{ path: 'suppliers', loadChildren: () => import('./modules/suppliers/suppliers.module' ).then(m => m.SuppliersModule) },
	{ path: 'strings', loadChildren: () => import('./modules/strings/strings.module' ).then(m => m.StringsModule) },
	{ path: 'company', loadChildren: () => import('./modules/company/company.module' ).then(m => m.CompanyModule) },
	{ path: 'application', loadChildren: () => import('./modules/application/application.module' ).then(m => m.ApplicationModule) },
	{ path: 'companyApplicationToken', loadChildren: () => import('./modules/company-application-token/company-application-token.module' ).then(m => m.CompanyApplicationTokenModule) },
	{ path: 'devices', loadChildren: () => import('./modules/devices/devices.module' ).then(m => m.DevicesModule) },
	{ path: 'session', loadChildren: () => import('./modules/session/session.module' ).then(m => m.SessionModule) },
	{ path: 'users', loadChildren: () => import('./modules/users/users.module' ).then(m => m.UsersModule) },
	{ path: 'roles', loadChildren: () => import('./modules/roles/roles.module' ).then(m => m.RolesModule) },
	{ path: 'functionssystem', loadChildren: () => import('./modules/functions-system/functions-system.module' ).then(m => m.FunctionsSystemModule) },
	{ path: 'functionssystemroles', loadChildren: () => import('./modules/functions-system-roles/functions-system-roles.module' ).then(m => m.FunctionsSystemRolesModule) },
          {path: '**', redirectTo: '/404-not-found'}, 
        ] 
    }, 
]; 
