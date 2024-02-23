import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class PurchaseOrderStatus extends BaseResourceModel {
    id?: any;
    status?: string;

    static fromJson(jsonData: any): PurchaseOrderStatus{ 
        return Object.assign(new PurchaseOrderStatus(), jsonData); 
    } 
}

