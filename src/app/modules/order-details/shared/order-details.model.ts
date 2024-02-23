import { Orders } from "app/modules/orders/shared/orders.model";
import { Products } from "app/modules/products/shared/products.model";
import { OrderDetailsStatus } from "app/modules/order-details-status/shared/order-details-status.model";

import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class OrderDetails extends BaseResourceModel {
    id?: any;
    order?: Orders;
    product?: Products;
    quantity?: number;
    unitPrice?: number;
    discount?: number;
    status?: OrderDetailsStatus;
    dateAllocated?: Date;
    purchaseOrderId?: number;
    inventoryId?: number;

    static fromJson(jsonData: any): OrderDetails{ 
        return Object.assign(new OrderDetails(), jsonData); 
    } 
}

