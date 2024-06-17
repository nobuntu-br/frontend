export interface IPageStructure {
  config: IPageStructureConfig;
  attributes: IPageStructureAttribute[];
  
}

export interface IPageStructureConfig {
  modified: Date;
  description: string;
  name: string;
  apiUrl: string;
  route: string;
  localStorage: boolean;
  filter: boolean;
  searchableFields: ISearchableField[];
  addNew: boolean;
  edit: boolean;
  columnsQuantity: number;
  delete: boolean;
  isFormStepper: boolean;
  isLinearFormStepper: boolean;
}

export interface ISearchableField {
  name: string,
  type: string
}

export interface IPageStructureAttribute {
  name: string;
  type: string;
  isRequired: boolean,
  className: string;
  many: boolean;
  apiUrl: string;
  fieldDisplayedInLabel: string;
  visibleCard: boolean;
  visibleGrid: boolean;
  visibleFilter: boolean;
  visibleList: boolean;
  forageinKey: string;
  lookup: boolean;
  viewDetails: boolean;
  searchable: string[];
  addNew: boolean;
  properties: IPageStructureAttributesProperties[];
  visibleForm: boolean;
  formTab: string;
}

export interface IPageStructureAttributesProperties {
  type: string;
  name: string;
  visibleCard: boolean;
  visibleGrid: boolean;
  visibleFilter: boolean;
  visibleList: boolean;
  visibleForm: boolean;
}

export class PageStructure implements IPageStructure {
  config: IPageStructureConfig;
  attributes: IPageStructureAttribute[];

  constructor(data: IPageStructure) {
    
  }
}