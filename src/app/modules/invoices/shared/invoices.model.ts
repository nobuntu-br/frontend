import { Orders } from "app/modules/orders/shared/orders.model";

import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class Invoices extends BaseResourceModel {
    id?: any;
    order?: Orders;
    invoiceDate?: Date;
    dueDate?: Date;
    tax?: number;
    shipping?: number;
    amountDue?: number;

    static fromJson(jsonData: any): Invoices{ 
        return Object.assign(new Invoices(), jsonData); 
    } 
}

