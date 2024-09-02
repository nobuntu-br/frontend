import { BaseResourceModel } from "app/shared/models/base-resource.model";

export class UserModel extends BaseResourceModel {
    UID: string;
    TenantUID: string;
    username: string;
    firstname: string;
    lastname: string;
    isAdministrator: boolean;
    memberType: string;
    Roles?: string[];
    tenants?: string[];

    static fromJson(jsonData: any): UserModel {
        return Object.assign(new UserModel(), jsonData);
    }
}

