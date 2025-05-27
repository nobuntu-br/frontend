import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultCardComponent } from '../default-card/default-card.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ConsultaFormComponent } from './consulta-form/consulta-form.component';
import { environment } from 'environments/environment';
import { IPageStructureAttribute } from 'app/shared/models/pageStructure';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-default-consulta',
  templateUrl: './default-consulta.component.html',
  styleUrls: ['./default-consulta.component.scss']
})
export class DefaultConsultaComponent {

  @ViewChild('placeToRender', { read: ViewContainerRef })
  target!: ViewContainerRef;

  /**
   * Nome da consulta
   */
  @Input() name: string;

  /**
   * Descrição da consulta
   */
  @Input() descricao: string;

  /**
   * URL da API
   */
  @Input() apiUrl: string;

  /**
   * Parametros da consulta
   */
  @Input() parameters: IPageStructureAttribute[];

  /**
   * Retorno da consulta
   */
  @Input() return: IPageStructureAttribute[];


  /**
   * Campo com os dados dos itens que serÃo apresenados na lista.
   * @example ['nome':'Maria', 'idade':'44'].
   */
  itemsDisplayed: any;
  
  viewMode: string = 'card'; // Definindo o modo padrão como 'list'
  isLoading: boolean = true;
  componentsCreatedList: any[] = [];
  inputValue: FormControl<object[]> = new FormControl<object[]>([]);
  formGroup: FormGroup = new FormGroup({
    inputValue: this.inputValue
  });;

  constructor(private http: HttpClient, private matSnackBar: MatSnackBar, private matDialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.getParameters();
  }

  /**
   * Função que irá buscar os parametros da consulta.
   */
  getParameters() {
    let resourceForm = new FormGroup({});
    const dialogRef = this.matDialog.open(ConsultaFormComponent, {
      id: 'consulta-form',
      // width: '100vh',
      // height: '100vh',
      data: {
        submitFormFunction: this.getDataFromAPI.bind(this),
        parameters: this.parameters.map((param, index) => {
          return {
            target: null,
            resourceForm: resourceForm,
            className: param.name,
            fieldName: param.name,
            fieldType: param.type,
            isRequired: false,
            labelTittle: param.name,
            dataToCreatePage: null,
            fieldDisplayedInLabel: param.name,
            index: index,
            optionList: param.optionList,
            selectItemsLimit: param.selectItemsLimit,
          }
        }),
        resourceForm: resourceForm,
        returnFormFunction: () => {
          dialogRef.close(resourceForm.value);
        }
      }
    })
  }

  getDataFromAPI(parameters: any, resourceForm: FormGroup) {
    if(!resourceForm.valid) {
      resourceForm.markAllAsTouched();
      this.matSnackBar.open('Preencha todos os campos obrigatórios', 'Fechar', {
        duration: 5000
      });
      return;
    }
    this.matDialog.getDialogById('consulta-form').close();
    const url = this.getUrlWithParameters(parameters);
    this.http.get(url).subscribe((data: any) => {
      this.itemsDisplayed = data;
      this.createItemsOnList(this.itemsDisplayed);
      this.isLoading = false;
    }, (error) => {
      this.matSnackBar.open('Erro ao buscar dados da API', 'Fechar', {
        duration: 5000        
      });
    });
  }

  getUrlWithParameters(parameters: any) {
    let url = environment.backendUrl + '/api/consulta/' + this.apiUrl + '?';

    for(let field in parameters) {
      url += field + '=' + parameters[field] + '&';
    }

    return url;
  }

    /**
   * Função que irá instanciar os components Card na tela, com os dados dos itens.
   * @param itemsDisplayed Array com os itens que serão apresentados. @example [{"name":"Marie", "age":22}, {"name":"Josef", "age":32}]
   */
    createItemsOnList(itemsDisplayed: any[]) {
      this.componentsCreatedList = [];
      this.removeAllComponentsOnView();
  
      for (let index = 0; index < itemsDisplayed.length; index++) {
        let componentCreated = this.target.createComponent(DefaultCardComponent).instance;
  
        this.componentsCreatedList.push(componentCreated);
  
        componentCreated.columnsQuantity = 3;
        componentCreated.objectDisplayedValue = this.return.map((field) => field.fieldDisplayedInLabel).join(', ');
        componentCreated.userConfig = null;
        componentCreated.itemDisplayed = itemsDisplayed[index];
        componentCreated.displayedfieldsName = this.return.map((field) => field.name);

        componentCreated.fieldsType = this.return.map((field) => field.type);
        componentCreated.isEditable = false;
      }
    } 
    
    private removeAllComponentsOnView() {
      this.target.clear();
    }

    onNewButtonClick() {
      if (!this.itemsDisplayed || this.itemsDisplayed.length === 0) {
        this.matSnackBar.open('Nenhum dado disponível para exportar', 'Fechar', {
          duration: 3000,
        });
        return;
      }
    
      const isYelum = this.name === 'ConsultaYelum';
    
      if (isYelum) {
        // Formato .fro (formato especial)
        const exportFields = this.return.filter(f => f.name !== 'Contratação');
    
        const lines: string[] = ['[2.0.3.2]'];
        this.itemsDisplayed.forEach(item => {
          const line = exportFields.map(field => {
            const value = item[field.name];
            return value != null ? value : '';
          }).join(';');
          lines.push(line);
        });
    
        const froContent = lines.join('\n');
        const blob = new Blob([froContent], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, `${this.name}-${new Date().toISOString()}.fro`);
      } else {
        // Formato Excel (.xlsx ou .xlk)
        const columnHeaders = this.return.map(field => field.fieldDisplayedInLabel || field.name);
    
        const dataRows = this.itemsDisplayed.map(item => {
          const row: any = {};
          this.return.forEach(field => {
            const columnLabel = field.fieldDisplayedInLabel || field.name;
            row[columnLabel] = item[field.name] ?? '';
          });
          return row;
        });
    
        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
        XLSX.utils.sheet_add_aoa(worksheet, [[], columnHeaders], { origin: 0 });
        XLSX.utils.sheet_add_json(worksheet, dataRows, {
          origin: 2,
          header: columnHeaders,
          skipHeader: true
        });
    
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Consulta': worksheet },
          SheetNames: ['Consulta'],
        };
    
        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
    
        const blob: Blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
    
        const fileExtension = this.name === 'ConsultaYelum' ? '.xlk' : '.xlsx';
        FileSaver.saveAs(blob, `${this.name || 'consulta'}-${new Date().toISOString()}${fileExtension}`);
      }
    }
    
}
