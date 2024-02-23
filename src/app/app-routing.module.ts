import { Route } from '@angular/router'; 
import { AuthGuard } from 'app/core/auth/guards/auth.guard'; 
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'; 
// import { LayoutComponent } from 'app/layout/layout.component'; 


export const appRoutes: Route[] = [ 

    // Redirect empty path to '/example' 
    {path: '', pathMatch : 'full', redirectTo: ''}, 

    // Auth routes for guests 
    // { 
    //     path: '', 
    //     canMatch: [NoAuthGuard], 
    //     component: LayoutComponent, 
    //     data: { 
    //         layout: 'empty' 
    //     }, 
    //     children: [ 
    //         {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)}, 
    //         {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)}, 
    //         {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)}, 
    //         {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)}, 
    //         {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}, 
    //     ] 
    // }, 

    // Auth routes for authenticated users 
    // {
    //     path: '', 
    //     canMatch: [AuthGuard], 
    //     component: LayoutComponent, 
    //     data: { 
    //         layout: 'empty' 
    //     }, 
    //     children: [ 
    //         {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)}, 
    //         {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}, 
    //     ] 
    // }, 

    // Admin routes 
    { 
        path: '', 
        canMatch: [NoAuthGuard], 
        children: [ 
	{ path: 'customers', loadChildren: () => import('./modules/customers/customers.module' ).then(m => m.CustomersModule) },
	{ path: 'employees', loadChildren: () => import('./modules/employees/employees.module' ).then(m => m.EmployeesModule) },
	{ path: 'inventoryTransactionTypes', loadChildren: () => import('./modules/inventory-transaction-types/inventory-transaction-types.module' ).then(m => m.InventoryTransactionTypesModule) },
	{ path: 'inventoryTransactions', loadChildren: () => import('./modules/inventory-transactions/inventory-transactions.module' ).then(m => m.InventoryTransactionsModule) },
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
        ] 
    }, 
]; 
