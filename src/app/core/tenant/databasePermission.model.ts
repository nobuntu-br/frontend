import { BaseResourceModel } from "app/shared/models/base-resource.model";
import { Tenant } from "./tenant.model";

export interface IDatabasePermission  extends BaseResourceModel {
  tenant: Tenant;
  databaseCredential: {
    id: number,
  };
  userUID: string;
  userId: number;
  isAdmin?: boolean;
}

export class DatabasePermission extends BaseResourceModel implements IDatabasePermission {
  tenant: Tenant;
  databaseCredential: { id: number; };
  userUID: string;
  userId: number;
  isAdmin?: boolean;
  name?: string;

  static fromJson(jsonData: any): DatabasePermission {
    return Object.assign(new DatabasePermission(), jsonData);
  }
}