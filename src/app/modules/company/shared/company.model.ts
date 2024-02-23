import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class Company extends BaseResourceModel {
    id?: any;
    name?: string;
    databaseSchema?: string;

    static fromJson(jsonData: any): Company{ 
        return Object.assign(new Company(), jsonData); 
    } 
}

