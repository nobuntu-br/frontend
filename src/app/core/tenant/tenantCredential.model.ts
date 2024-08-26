import { BaseResourceModel } from "app/shared/models/base-resource.model";

export interface ITenantCredential {
  dbName?: string;
  dbType?: string;
  dbUsername?: string;
  dbPassword?: string;
  dbHost?: string;
  dbPort?: string;
  dbConfig?: string;
}

export class TenantCredential extends BaseResourceModel implements ITenantCredential {
  dbName?: string;
  dbType?: string;
  dbUsername?: string;
  dbPassword?: string;
  dbHost?: string;
  dbPort?: string;
  dbConfig?: string;

  static fromJson(jsonData: any) : TenantCredential {
    return Object.assign(new TenantCredential(), jsonData);
  }
}