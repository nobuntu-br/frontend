import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class OrderDetailsStatus extends BaseResourceModel {
    id?: any;
    statusName?: string;

    static fromJson(jsonData: any): OrderDetailsStatus{ 
        return Object.assign(new OrderDetailsStatus(), jsonData); 
    } 
}

