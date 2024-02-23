import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryTransactionTypesFormComponent } from './inventory-transaction-types-form/inventory-transaction-types-form.component'; 
import { ListInventoryTransactionTypesComponent } from './list-inventory-transaction-types/list-inventory-transaction-types.component'; 


const routes: Routes = [
  { path: '', component: ListInventoryTransactionTypesComponent}, 
  { path: 'new', component: InventoryTransactionTypesFormComponent}, 
  { path: ':id/edit', component: InventoryTransactionTypesFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class InventoryTransactionTypesRoutingModule { }
