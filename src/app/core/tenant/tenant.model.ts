import { BaseResourceModel } from "app/shared/models/base-resource.model";

export interface ITenant {
  TenantCredentialId: string;
  TenantId: string;
}

export class Tenant extends BaseResourceModel implements ITenant {
  TenantCredentialId: string;
  TenantId: string;

  static fromJson(jsonData: any): Tenant {
    return Object.assign(new Tenant(), jsonData);
  }
}
