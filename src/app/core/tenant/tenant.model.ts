import { BaseResourceModel } from "app/shared/models/base-resource.model";

export interface ITenant {
  tenantCredentialId: string;
  tenantId: string;
  name: string;
}

export class Tenant extends BaseResourceModel implements ITenant {
  tenantCredentialId: string;
  tenantId: string;
  name: string;

  static fromJson(jsonData: any): Tenant {
    return Object.assign(new Tenant(), jsonData);
  }
}
