import { Suppliers } from "app/modules/suppliers/shared/suppliers.model";
import { Employees } from "app/modules/employees/shared/employees.model";
import { PurchaseOrderStatus } from "app/modules/purchase-order-status/shared/purchase-order-status.model";
import { PurchaseOrderDetails } from "app/modules/purchase-order-details/shared/purchase-order-details.model";

import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class PurchaseOrders extends BaseResourceModel {
    id?: any;
    supplier?: Suppliers;
    createdBy?: Employees;
    submittedDate?: Date;
    creationDate?: Date;
    status?: PurchaseOrderStatus;
    expectedDate?: Date;
    shippingFee?: number;
    taxes?: number;
    paymentDate?: Date;
    paymentAmount?: number;
    paymentMethod?: string;
    notes?: string;
    approvedBy?: number;
    approvedDate?: Date;
    submittedBy?: number;
    purchaseOrderDetails?: PurchaseOrderDetails[];

    static fromJson(jsonData: any): PurchaseOrders{ 
        return Object.assign(new PurchaseOrders(), jsonData); 
    } 
}

