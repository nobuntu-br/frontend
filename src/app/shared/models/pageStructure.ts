export interface IPageStructure {
  config: IPageStructureConfig;
  attributes: IPageStructureAttribute[];
}


export interface IconOption {
  nome: string;
  valor: number;
}

export interface IPageStructureConfig {
  modified: Date;
  description: string;
  name: string;
  limiteOfChars: number; //criado novo
  apiUrl: string;
  route: string;
  title: ITitle;
  localStorage: boolean;
  filter: boolean;
  searchableFields: ISearchableField[];
  steps: string[];
  addNew: boolean;
  edit: boolean;
  columnsQuantity: number;
  delete: boolean;
  isFormStepper: boolean;
  isLinearFormStepper: boolean;
  icones?: IconOption[];
  mask?: string;
  maskType?: string; // criado novo
  charactersLimit?: number;
  numberOfIcons?: number[];  //criado novo
  conditionalVisibility?: { field: string, values: string[] }; //criado novo
  locationMarker?: { lat: number, lng: number, quadrant?: string }; //criado novo?
  needMaskValue?: boolean; //criado novo
  numberOfDecimals?: number; //criado novo
  decimalSeparator?: string; //criado novo
}

export interface ITitle {
  pt: string;
  en: string;
}

export interface ISearchableField {
  name: string,
  type: string
}

export interface IPageStructureAttribute {
  name: string;
  type: string;
  limiteOfChars: number; //criado novo
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
  defaultValue: string;
  selectItemsLimit?: number;
  optionList?: any[];
  step?: string;
  allowedExtensions?: string[];
  icones?: IconOption[];
  mask?: string;
  maxFileSize?: number;
  maskType?: string; // criado novo
  charactersLimit?: number;
  numberOfIcons?: number[];  //criado novo
  conditionalVisibility?: { field: string, values: string[] }; //criado novo
  locationMarker?: { lat: number, lng: number, quadrant?: string }; //criado novo?
  needMaskValue?: boolean; //criado novo
  numberOfDecimals?: number; //criado novo
  decimalSeparator?: string; //criado novo
}

export interface IPageStructureAttributesProperties {
  type: string;
  name: string;
  visibleCard: boolean;
  visibleGrid: boolean;
  visibleFilter: boolean;
  visibleList: boolean;
  visibleForm: boolean;
  conditionalVisibility?: { field: string, values: string[] };  //criado novo
  locationMarker?: { lat: number, lng: number, quadrant?: string }; //criado novo
}

export class PageStructure implements IPageStructure {
  config: IPageStructureConfig;
  attributes: IPageStructureAttribute[];

  constructor(data: IPageStructure) {
    
  }
}