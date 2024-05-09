import { BaseResourceModel } from "app/shared/models/base-resource.model";

export class User extends BaseResourceModel {
    UID: string;
    TenantUID: string;
    username: string;
    firstName: string;
    lastName: string;
    isAdministrator: boolean;
    memberType: string;
    Roles: string[];

    static fromJson(jsonData: any): User {
        return Object.assign(new User(), jsonData);
    }
}

