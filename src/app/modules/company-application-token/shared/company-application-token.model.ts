import { Company } from "app/modules/company/shared/company.model";
import { Application } from "app/modules/application/shared/application.model";

import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class CompanyApplicationToken extends BaseResourceModel {
    id?: any;
    company?: Company;
    application?: Application;
    token?: string;

    static fromJson(jsonData: any): CompanyApplicationToken{ 
        return Object.assign(new CompanyApplicationToken(), jsonData); 
    } 
}

