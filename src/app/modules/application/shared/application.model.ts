import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class Application extends BaseResourceModel {
    id?: any;
    name?: string;

    static fromJson(jsonData: any): Application{ 
        return Object.assign(new Application(), jsonData); 
    } 
}

