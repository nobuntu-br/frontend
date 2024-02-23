import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class OrdersStatus extends BaseResourceModel {
    id?: any;
    statusName?: string;

    static fromJson(jsonData: any): OrdersStatus{ 
        return Object.assign(new OrdersStatus(), jsonData); 
    } 
}

