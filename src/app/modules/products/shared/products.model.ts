import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class Products extends BaseResourceModel {
    id?: any;
    supplierIds?: string;
    productCode?: string;
    productName?: string;
    description?: string;
    standardCost?: number;
    listPrice?: number;
    reorderLevel?: number;
    targetLevel?: number;
    quantityPerUnit?: string;
    discontinued?: boolean;
    minimumReorderQuantity?: number;
    category?: string;
    attachments?: boolean;

    static fromJson(jsonData: any): Products{ 
        return Object.assign(new Products(), jsonData); 
    } 
}

