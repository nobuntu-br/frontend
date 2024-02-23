import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class SalesReports extends BaseResourceModel {
    id?: any;
    display?: string;
    title?: string;
    filterRowSource?: string;
    padrao?: boolean;

    static fromJson(jsonData: any): SalesReports{ 
        return Object.assign(new SalesReports(), jsonData); 
    } 
}

