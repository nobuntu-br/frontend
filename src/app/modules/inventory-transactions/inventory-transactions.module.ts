import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryTransactionsRoutingModule } from './inventory-transactions-routing.module';
import { InventoryTransactionsFormComponent } from './inventory-transactions-form/inventory-transactions-form.component';
import { ListInventoryTransactionsComponent } from './list-inventory-transactions/list-inventory-transactions.component';


@NgModule({
  declarations: [
    InventoryTransactionsFormComponent,
    ListInventoryTransactionsComponent
  ],
  imports: [
    CommonModule,
    InventoryTransactionsRoutingModule
  ]
})
export class InventoryTransactionsModule { }
