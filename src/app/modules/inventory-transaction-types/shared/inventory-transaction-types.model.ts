import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class InventoryTransactionTypes extends BaseResourceModel {
    id?: any;
    typeName?: string;

    static fromJson(jsonData: any): InventoryTransactionTypes{ 
        return Object.assign(new InventoryTransactionTypes(), jsonData); 
    } 
}

