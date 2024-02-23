import { AfterViewInit, Component, EventEmitter, Inject, Injector, Input, OnDestroy, Optional, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DefaultListComponent } from '../default-list/default-list.component';
import { SelectableCardComponent } from '../selectable-card/selectable-card.component';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DinamicBaseResourceFormComponent } from '../dinamic-base-resource-form/dinamic-base-resource-form.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-selected-items-list',
  templateUrl: './selected-items-list.component.html',
  styleUrls: ['./selected-items-list.component.scss']
})
export class SelectedItemsListComponent implements AfterViewInit, OnDestroy {
  /**
   * Array com os valores dos itens que serão apresentados na lista.\
   * Exemplo: [{'nome':'Mario', 'idade':23},{'nome':'Maria','idade':34}].
   */
  @Input() itemsDisplayed: any[] = [];
  /**
   * Quantidade de colunas que tenha cada Card da lista.\
   * Exemplo: 3.\
   * Por padrão quando se está em dispositivos móveis a quantidade de colunas será 1.
   */
  @Input() columnsQuantity: number;
  /**
   * Nomes dos campos que serão apresentados.\
   * Exemplo: ['nome', 'idade'].
   */
  @Input() displayedfieldsName: string[] | null;
  /**
   * Tipos das variáveis da classe.\
   * Exemplo: ['string', 'number'].
   */
  @Input() fieldsType: string[];
  /**
   * Essa lista será uma lista que tu seleciona os itens?\
   * Exemplo: true;
   */
  isSelectable: boolean = true;
  /**
   * Valor máximo de itens que podem ser selecionados.\
   * Exemplo: 2.\
   * Exemplo para querer poder selecionar tudo: null.
   */
  selectedItemsLimit: number = null;
  /**
   * Campo que saída para os valores que foram selecionados.\
   */
  @Output() eventSelectedValues = new EventEmitter<any[]>();
  /**
   * Link completo no qual é capaz de obter as instâncias dessa classe no banco de dados.\
   * Exemplo: https://siteDoProgramador.com/api/carros
   */
  @Input() apiUrl: string;
  /**
   * Campos pelo qual será realizada a busca no campo de buscas.\
   * Exemplo: ['name','phone'].
   */
  @Input() searchableFields: string[] | null = null;
  @Input() className: string;
  @Input() fieldName: string;
  @Input() JSONPath: string;

  selectedItems: any[] = [];
  private componentsCreatedList: any[] = [];
  selectAllCheckBox: boolean = false;

  @ViewChild('placeToRender', { read: ViewContainerRef }) target!: ViewContainerRef;

  @Input() inputValue: FormControl<string[] | null>;

  private dialog: MatDialog;
  private router: Router;

  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  constructor(
    protected injector: Injector,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogInjectorData: { itemsDisplayed: any[], columnsQuantity: number, displayedfieldsName: string[], fieldsType: string[], userConfig: any, selectedItemsLimit: number, apiUrl: string, searchableFields: string[] | null, isSelectable: boolean, className: string, fieldName: string, JSONPath: string, inputValue: FormControl<string[] | null> },
    @Optional() private matDialogComponentRef: MatDialogRef<SelectedItemsListComponent>,
  ) {

    this.dialog = this.injector.get(MatDialog);
    this.router = this.injector.get(Router);

    if (dialogInjectorData != null) {
      this.itemsDisplayed = dialogInjectorData.itemsDisplayed;
      this.columnsQuantity = dialogInjectorData.columnsQuantity;
      this.displayedfieldsName = dialogInjectorData.displayedfieldsName;
      this.fieldsType = dialogInjectorData.fieldsType;
      this.apiUrl = dialogInjectorData.apiUrl;
      this.className = dialogInjectorData.className;
      this.fieldName = dialogInjectorData.fieldName;
      this.JSONPath = dialogInjectorData.JSONPath;
      this.inputValue = dialogInjectorData.inputValue;
    }

  }
  ngAfterViewInit(): void {
    if (this.inputValue.value != null) {
      this.itemsDisplayed = this.inputValue.value;

      setTimeout(() => {
        this.createItemsOnList(this.itemsDisplayed, this.displayedfieldsName);
      }, 0);

    }
  }

  createItemsOnList(itemsDisplayed: any[], displayedfieldsName: string[] | null) {

    this.componentsCreatedList = [];
    this.target.clear();

    for (let index = 0; index < itemsDisplayed.length; index++) {
      let componentCreated;
      componentCreated = this.target.createComponent(SelectableCardComponent).instance;

      this.componentsCreatedList.push(componentCreated);

      componentCreated.columnsQuantity = this.columnsQuantity;
      componentCreated.itemDisplayed = itemsDisplayed[index];

      componentCreated.displayedfieldsName = this.displayedfieldsName;
      componentCreated.fieldsType = this.fieldsType;
      componentCreated.isEditable = true;
      componentCreated.className = this.className;

      this.selectableFieldController(componentCreated);
    }

  }

  removeAllComponentsOnView() {
    if (this.target == null) console.warn("target é null");
    this.target.clear();
  }

  selectableFieldController(componentCreated: SelectableCardComponent) {
    if (this.selectedItemsLimit == null) {
      this.selectedItemsLimit = this.itemsDisplayed.length;
    }

    if (this.selectedItemsLimit == 1) {
      componentCreated.isCheckBox = false;
    } else {
      componentCreated.isCheckBox = true;
    }

    componentCreated.eventOnSelect.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      this.checkItem(this.selectedItemsLimit, componentCreated, data);
    });

    componentCreated.eventClickToEdit.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      this.openFormDialog("edit", data);
    })
  }

  checkItem(selectedItemsLimit: number, componentCreated: SelectableCardComponent, data) {
    const dataIsSelected: boolean = this.selectedItems.some(item => item === data);

    if (this.selectedItems.length == this.itemsDisplayed.length - 1) {
      this.selectAllCheckBox = true;
    }

    if (dataIsSelected == false) {

      if (selectedItemsLimit != null) {
        if (this.selectedItems.length < selectedItemsLimit) {
          this.selectedItems.push(data);
          componentCreated.isSelected = true;
        }
      } else {
        this.selectedItems.push(data);
        componentCreated.isSelected = true;
      }

    } else {
      if (this.selectAllCheckBox == true) {
        this.selectAllCheckBox = false;
      }
      this.selectedItems = this.selectedItems.filter(item => item !== data);
      componentCreated.isSelected = false;
    }
  }


  /**
   * Abre um dialog com um formuário que permite a edição do item;
   * @param data Dados do item a ser criado ou editado
   */
  openFormDialog(currentAction: string, data?) {

    const dialogRef = this.dialog.open(DinamicBaseResourceFormComponent, {
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

    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      if (item == null) return;

      if ('action' in item){
        console.log(item.data.id);
        const itemIndex = this.itemsDisplayed.findIndex(_item => _item.id === item.data.id);//Encontra o item pelo ID
        console.log(itemIndex);
        this.itemsDisplayed.splice(itemIndex, 1);
        this.createItemsOnList(this.itemsDisplayed, this.displayedfieldsName);
        return;  
      } 

      const itemIndex = this.itemsDisplayed.findIndex(item => item.id === data.id);//Encontra o item pelo ID

      if (itemIndex !== -1) {
        this.itemsDisplayed[itemIndex] = item; //Atualizar a lista com dados do item alterado
      } else {
        this.itemsDisplayed.push(item); //Adicionar novo item na lista
      }

      this.createItemsOnList(this.itemsDisplayed, this.displayedfieldsName);
    });

  }

  openListDialog(): void {
    const dialogRef = this.dialog.open(DefaultListComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: {
        itemsDisplayed: [],
        columnsQuantity: this.columnsQuantity,
        displayedfieldsName: this.displayedfieldsName,
        fieldsType: this.fieldsType,
        userConfig: null,
        selectedItemsLimit: this.selectedItemsLimit,
        apiUrl: this.apiUrl,
        searchableFields: null,
        isSelectable: true,
        className: this.className,
        isAbleToCreate: false,
        isAbleToEdit: false
      },

    });

    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(items => {
      console.log(items);
      if (items == null) return;
      if (items.length == 0) return;

      for (let itemIndex = 0; itemIndex < this.itemsDisplayed.length; itemIndex++) {
        
        for (let itemsDisplayedIndex = 0; itemsDisplayedIndex < this.itemsDisplayed.length; itemsDisplayedIndex++) {
          if(this.itemsDisplayed[itemsDisplayedIndex].id === items[itemIndex].id){
            items.splice(itemIndex, 1);
          }
        }
      }
      
      this.itemsDisplayed.push(...items);
      // this.inputValue.setValue(this.itemsDisplayed.map(item => item.firstName));
      this.createItemsOnList(this.itemsDisplayed, this.displayedfieldsName);
    });
  }

  closeThisDialog() {
    if (this.matDialogComponentRef != null) {
      this.matDialogComponentRef.close(this.itemsDisplayed);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
