import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultCardComponent } from '../default-card/default-card.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ConsultaFormComponent } from './consulta-form/consulta-form.component';
import { environment } from 'environments/environment';
import { IPageStructureAttribute } from 'app/shared/models/pageStructure';

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
      // width: '100vh',
      // height: '100vh',
      data: {
        submitFormFunction: this.getDataFromAPI.bind(this),
        parameters: this.parameters,
        resourceForm: resourceForm,
        returnFormFunction: () => {
          dialogRef.close(resourceForm.value);
        }
      }
    })
  }

  getDataFromAPI(parameters: any) {
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
    let url = environment.backendUrl + '/' + this.apiUrl + '?';

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

}
