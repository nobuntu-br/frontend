import { InventoryTransactionTypes } from "app/modules/inventory-transaction-types/shared/inventory-transaction-types.model";
import { Products } from "app/modules/products/shared/products.model";
import { PurchaseOrders } from "app/modules/purchase-orders/shared/purchase-orders.model";
import { Orders } from "app/modules/orders/shared/orders.model";

import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class InventoryTransactions extends BaseResourceModel {
    id?: any;
    transactionType?: InventoryTransactionTypes;
    transactionCreatedDate?: Date;
    transactionModifiedDate?: Date;
    product?: Products;
    quantity?: number;
    purchaseOrder?: PurchaseOrders;
    customerOrder?: Orders;
    comments?: string;

    static fromJson(jsonData: any): InventoryTransactions{ 
        return Object.assign(new InventoryTransactions(), jsonData); 
    } 
}

