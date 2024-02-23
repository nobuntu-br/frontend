import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class Strings extends BaseResourceModel {
    id?: any;
    stringData?: string;

    static fromJson(jsonData: any): Strings{ 
        return Object.assign(new Strings(), jsonData); 
    } 
}

