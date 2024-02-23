import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryTransactionsFormComponent } from './inventory-transactions-form/inventory-transactions-form.component'; 
import { ListInventoryTransactionsComponent } from './list-inventory-transactions/list-inventory-transactions.component'; 


const routes: Routes = [
  { path: '', component: ListInventoryTransactionsComponent}, 
  { path: 'new', component: InventoryTransactionsFormComponent}, 
  { path: ':id/edit', component: InventoryTransactionsFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class InventoryTransactionsRoutingModule { }
