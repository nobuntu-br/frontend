import { User } from "oidc-client-ts";
import { BaseResourceModel } from "./base-resource.model";

export interface IFieldFile extends BaseResourceModel {
    fieldType: string;
    files: IFile[];
    user?: User;
}

export interface IFile extends BaseResourceModel {
    name: string;
    size: number;
    extension: string;
    dataBlob: Blob | string;
    base64?: string;
}

export class FieldFile extends BaseResourceModel implements IFieldFile {
    fieldType: string;
    files: IFile[];
    user?: User;

    constructor() {
        super();
        this.fieldType = 'file';
        this.files = [];
    }
}
