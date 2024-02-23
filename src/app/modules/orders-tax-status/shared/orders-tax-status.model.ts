import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class OrdersTaxStatus extends BaseResourceModel {
    id?: any;
    taxStatusName?: string;

    static fromJson(jsonData: any): OrdersTaxStatus{ 
        return Object.assign(new OrdersTaxStatus(), jsonData); 
    } 
}

