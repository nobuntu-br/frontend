import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryTransactionTypesRoutingModule } from './inventory-transaction-types-routing.module';
import { InventoryTransactionTypesFormComponent } from './inventory-transaction-types-form/inventory-transaction-types-form.component';
import { ListInventoryTransactionTypesComponent } from './list-inventory-transaction-types/list-inventory-transaction-types.component';


@NgModule({
  declarations: [
    InventoryTransactionTypesFormComponent,
    ListInventoryTransactionTypesComponent
  ],
  imports: [
    CommonModule,
    InventoryTransactionTypesRoutingModule
  ]
})
export class InventoryTransactionTypesModule { }
