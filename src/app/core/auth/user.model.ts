import { BaseResourceModel } from "app/shared/models/base-resource.model";

export interface IUserAccessInfo {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: number
}

export interface IUser {
  id?: string;
  UID: string;
  TenantUID: string;
  userName: string;
  firstName: string;
  lastName: string;
  isAdministrator: boolean;
  memberType: string;
  Roles ?: string[];
  tenants ?: string[];
  email?: string;
  accessInfo?: IUserAccessInfo;
}

export class User extends BaseResourceModel implements IUser {
  UID: string;
  TenantUID: string;
  userName: string;
  firstName: string;
  lastName: string;
  isAdministrator: boolean;
  memberType: string;
  Roles?: string[];
  tenants?: string[];

  static fromJson(jsonData: any): User {
    return Object.assign(new User(), jsonData);
  }
}

