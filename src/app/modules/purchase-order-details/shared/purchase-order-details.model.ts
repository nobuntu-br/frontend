import { PurchaseOrders } from "app/modules/purchase-orders/shared/purchase-orders.model";
import { Products } from "app/modules/products/shared/products.model";
import { InventoryTransactions } from "app/modules/inventory-transactions/shared/inventory-transactions.model";

import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class PurchaseOrderDetails extends BaseResourceModel {
    id?: any;
    purchaseOrder?: PurchaseOrders;
    product?: Products;
    quantity?: number;
    unitCost?: number;
    dateReceived?: Date;
    postedToInventory?: boolean;
    inventory?: InventoryTransactions;

    static fromJson(jsonData: any): PurchaseOrderDetails{ 
        return Object.assign(new PurchaseOrderDetails(), jsonData); 
    } 
}

