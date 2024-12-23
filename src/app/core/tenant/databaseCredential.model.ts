import { BaseResourceModel } from "app/shared/models/base-resource.model";

export interface IDatabaseCredential {
  databaseName?: string;
  databaseType?: string;
  databaseUsername?: string;
  databasePassword?: string;
  databaseHost?: string;
  databasePort?: string;
  databaseConfig?: string;
}

export class DatabaseCredential extends BaseResourceModel implements IDatabaseCredential {
  databaseName?: string;
  databaseType?: string;
  databaseUsername?: string;
  databasePassword?: string;
  databaseHost?: string;
  databasePort?: string;
  databaseConfig?: string;

  static fromJson(jsonData: any) : DatabaseCredential {
    return Object.assign(new DatabaseCredential(), jsonData);
  }
}