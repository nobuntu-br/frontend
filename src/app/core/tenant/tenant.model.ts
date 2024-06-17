import { BaseResourceModel } from "app/shared/models/base-resource.model";

export class Tenant extends BaseResourceModel {
    dbURI: string;

    static fromJson(jsonData: any): Tenant {
        return Object.assign(new Tenant(), jsonData);
    }
}

