import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { DefaultListComponent } from '../default-list/default-list.component';
import { Subject, take, takeUntil } from 'rxjs';
import { SelectedItemsListComponent } from '../selected-items-list/selected-items-list.component';
import { DinamicBaseResourceFormComponent } from '../dinamic-base-resource-form/dinamic-base-resource-form.component';

@Component({
  selector: 'app-foreign-key-input-field',
  templateUrl: './foreign-key-input-field.component.html',
  styleUrls: ['./foreign-key-input-field.component.scss']
})

export class ForeignKeyInputFieldComponent implements OnInit, OnDestroy {
  /**
   * Titulo apresentado em cima do campo de inserção de dados
   */
  @Input() label: string;
  // @Input() apiUrl: string;
  @Input() fieldDisplayedInLabel: string;
  // @Input() fieldsDisplayed: string[] = [];
  // @Input() fieldsType: string[] = [];
  // @Input() columnsQuantity: number = 3;
  // @Input() selectedItemsLimit: number | null = null;
  // @Output() newValueEvent = new EventEmitter<{ value: String }>();
  // @Input() searchableFields: string[] | null = null;

  /**
   * Nome da classe na qual a variável desse componente pertence.
   * @example "Produtos"
   */
  @Input() className : string | null;
  /**
   * Nome da variável desse componente no formulário
   * @example "detalhes"
   */
  @Input() fieldName : string | null;
  /**
   * Localizade onde o JSON que orienta a criação das paginas se encontra.
   * @example "../../../../assets/dicionario/classe.json"
   */
  @Input() JSONPath: string | null;
  @Input() value: any;
  /**
   * Campo no formulário que receberá os dados dos valores selecionados.
   */
  public inputValue : FormControl<string[]> = new FormControl<string[]>([]);
  /**
   * Quantitade máxima de valores que podem ser selecionados.
   * @example "1"
   * Por padrão é 1
   */
  selectedItemsLimit: number = 1;
  /**
   * É obrigatório preencher esse campo.
   * @example "true" ou "false"
   */
  fieldIsRequired: boolean = false;
  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  constructor(
    private matDialog: MatDialog,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {

  }
  /*
  openList(apiUrl: string, fieldsType: string[], fieldsDisplayed: string[], columnsQuantity: number, selectedItemsLimit: number | string, fieldDisplayedInLabel: string, searchableFields : string[]) {

    const dialogRef = this.dialog.open(DefaultListComponent, {
      height: '80vh',
      width: '80vw',
      data: {
        columnsQuantity: columnsQuantity,
        fieldsDisplayed: fieldsDisplayed,
        fieldsType: fieldsType,
        apiUrl: apiUrl,
        selectedItemsLimit: selectedItemsLimit,
        searchableFields: searchableFields,
        isSelectable: true
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.newValueEvent.emit({ value: result });
      //TODO fazer a tratativa quando o usuário não definio o campo que aparece no inputField
      if(fieldDisplayedInLabel == null){
        fieldDisplayedInLabel = fieldsDisplayed[0];
      }
      this.inputValue.setValue(result.map(obj => obj[fieldDisplayedInLabel]));
    });

    dialogRef.disableClose = true;
    
  }
  */

  openSelectableItemsListDialog(){
    const dialogRef = this.matDialog.open(SelectedItemsListComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: {
        itemsDisplayed: [],
        columnsQuantity: 2,
        displayedfieldsName: this.value.propertiesAttributes.map(attribute => attribute.name),
        fieldsType: this.value.propertiesAttributes.map(attribute => attribute.type),
        userConfig: null,
        selectedItemsLimit: null,
        apiUrl: this.value.apiUrl,
        JSONPath: this.JSONPath,
        searchableFields: null,
        isSelectable: true,
        className: this.className,
        fieldName: this.fieldName,
        inputValue: this.inputValue 
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      // console.log(result);
      if (result == null) return;
      this.inputValue.setValue(result);
      // createdComponent.instance.inputValue = result;
    });
  }

  /**
   * Função que irá remover os itens que foram selecionados.
   */
  removeItensOnInputField(){
    this.inputValue.setValue([]);
  }

  
  /**
   * Abre um dialog com um formuário que permite a edição do item;
   * @param data Dados do item a ser criado ou editado. Se for null ele só criará.
   */
  openFormDialog(currentAction: string, data?) {

    const dialogRef = this.matDialog.open(DinamicBaseResourceFormComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: {
        JSONPath: this.JSONPath,
        className: this.fieldName,
        itemId: data?.id,
        currentAction: currentAction
      },

    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(item => {
      if (item == null) return;

      if ('action' in item){
        return;
      }

      this.selectItems([item]);

      //Se tiver algo, adicione se permitir mais que 1 item
    });

  }

  selectItems(newItems: any[]){
    if(newItems == null) return;
    
    let currentSelectedItensQuantity : number = 0;

    if(this.inputValue.value == null){
      currentSelectedItensQuantity = 0;
    } else {
      currentSelectedItensQuantity = this.inputValue.value.length;
    } 

    if(currentSelectedItensQuantity + newItems.length > this.selectedItemsLimit) return;

    newItems.push(...this.inputValue.value);

    this.inputValue.setValue(newItems);
    console.log("O valor do select Item com os itens adicionados deu: ",this.inputValue.value);
  }

  get getValue(): string[]{
    if(this.inputValue.value == null) return;
    if(this.inputValue.value.length == 0) return;
    return this.inputValue.value.map(item => item[this.fieldDisplayedInLabel]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }


}
