import { AfterViewInit, Component, EventEmitter, Inject, Injector, Input, OnDestroy, Optional, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { SelectableCardComponent } from '../selectable-card/selectable-card.component';
import { HttpClient } from '@angular/common/http';
import { DefaultCardComponent } from '../default-card/default-card.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'default-list',
  templateUrl: './default-list.component.html',
  styleUrls: ['./default-list.component.scss']
})
export class DefaultListComponent implements AfterViewInit, OnDestroy {
  /**
   * Campo com nome de itens que serão apresentados na lista.
   * @example ['nome', 'idade'].
   */
  @Input() itemsDisplayed: any[] = [];
  /**
   * Quantidade de colunas que tenha cada Card da lista.
   * @example "3"
   * Por padrão quando se está em dispositivos móveis a quantidade de colunas será 1.
   */
  @Input() columnsQuantity: number;
  /**
   * Nomes dos campos que serão apresentados.
   * @example ['nome', 'idade'].
   */
  @Input() displayedfieldsName: string[] | null;
  /**
   * Tipos das variáveis da classe.
   * @example ['string', 'number'].
   */
  @Input() fieldsType: string[];
  @Input() userConfig: any;
  /**
   * Essa lista será uma lista que tu seleciona os itens?
   * @example true;
   */
  @Input() isSelectable: boolean = true;
  /**
   * Valor máximo de itens que podem ser selecionados.
   * @example 2.\
   * Exemplo permitir selecionar tudo: null.
   */
  @Input() selectedItemsLimit: number = null;
  /**
   * Campo que saída para os valores que foram selecionados.
   */
  @Output() eventSelectedValues = new EventEmitter<any[]>();
  /**
   * Link completo no qual é capaz de obter as instâncias dessa classe no banco de dados.\
   * @example https://siteDoProgramador.com/api/carros
   */
  @Input() apiUrl: string;
  /**
   * Campos pelo qual será realizada a busca no campo de buscas.\
   * @example ['name','phone'].
   */
  @Input() searchableFields: string[] | null = null;
  /**
  * Número máximo de itens que serão renderizados na lista.\
  * @example 3
  */
  @Input() maxDisplayedItems: number = 25;
  /**
   * Nome da classe na qual o formulário pertence
   */
  @Input() className: string;
  /**
   * Indica se a lista terá botão que direcionará para criação de novos itens.
   * @example "true" ou "false"
   */
  @Input() isAbleToCreate: boolean = true;
  /**
   * Indica que cada card da lista terá um botão que direcionará para editar cada item.
   * @example "true" ou "false"
   */
  @Input() isAbleToEdit: boolean = true;
  /**
   * Indica que cada item da lista poderá ser removido.
   * @example "true" ou "false"
   */
  @Input() isAbleToDelete: boolean = true;
  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  /**
   * Itens da lista selecionados
   * @example [{'id':'1', 'nome':'aba'}, {'id':'2', 'nome':'Carlos'}]
   */
  selectedItems: any[] = [];
  /**
   * Lista com os componentes que estão sendo renderizados na lista.
   */
  private componentsCreatedList: any[] = [];
  /**
   * Estado do checkBox que seleciona todos os itens da lista.
   */
  selectAllCheckBox: boolean = false;
  /**
   * Estado que informa se o componente atual foi aberto por meio de um Dialog.
   * @example "true" ou "false"
   */
  isOpenedOnDialog: boolean = false;

  columnsQuantityStyle;

  @ViewChild('placeToRender', { read: ViewContainerRef }) target!: ViewContainerRef;

  protected router: Router;
  private http: HttpClient;
  private translocoService: TranslocoService;

  constructor(
    protected injector: Injector,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogInjectorData:
      {
        itemsDisplayed: any[],
        columnsQuantity: number,
        displayedfieldsName: string[],
        fieldsType: string[],
        userConfig: any,
        selectedItemsLimit: number,
        apiUrl: string,
        searchableFields: string[] | null,
        isSelectable: boolean,
        className: string,
        isAbleToCreate: boolean,
        isAbleToEdit: boolean
      },
    @Optional() private matDialogComponentRef: MatDialogRef<DefaultListComponent>,
  ) {

    this.router = this.injector.get(Router);
    this.http = this.injector.get(HttpClient);
    this.translocoService = this.injector.get(TranslocoService);

    if(matDialogComponentRef != null){
      this.isOpenedOnDialog = true;
    }
    if (dialogInjectorData != null) {

      this.itemsDisplayed = dialogInjectorData.itemsDisplayed;
      this.columnsQuantity = dialogInjectorData.columnsQuantity;
      this.displayedfieldsName = dialogInjectorData.displayedfieldsName;
      this.fieldsType = dialogInjectorData.fieldsType;
      this.userConfig = dialogInjectorData.userConfig;
      this.searchableFields = dialogInjectorData.searchableFields;

      if (dialogInjectorData.selectedItemsLimit >= 0) {
        this.selectedItemsLimit = dialogInjectorData.selectedItemsLimit;
      }

      this.apiUrl = dialogInjectorData.apiUrl;
      this.isSelectable = dialogInjectorData.isSelectable;
      this.className = dialogInjectorData.className;
      this.isAbleToCreate = dialogInjectorData.isAbleToCreate;
      this.isAbleToEdit = dialogInjectorData.isAbleToEdit;
    }

  }

  ngAfterViewInit(): void {
    this.getData(this.apiUrl);
  }

  getData(apiURL: string) {
    this.requestAllValuesFromAPI(apiURL).pipe(take(1)).subscribe((itemsDisplayed) => {
      this.itemsDisplayed = itemsDisplayed;

      if (itemsDisplayed.length == 0) return;

      if (this.maxDisplayedItems > this.itemsDisplayed.length) this.maxDisplayedItems = this.itemsDisplayed.length;

      const itemsToDisplay = this.itemsDisplayed.slice(0, this.maxDisplayedItems);

      this.createItemsOnList(itemsToDisplay);
    });
  }

  select() {
    this.eventSelectedValues.emit(this.selectedItems);
    this.closeMatDialog(this.selectedItems);
  }

  cancel() {
    this.eventSelectedValues.emit(null);
    this.closeMatDialog(null);
  }

  closeMatDialog(selectedItems: any[]) {
    if (this.matDialogComponentRef != null) {
      this.matDialogComponentRef.close(selectedItems);
    }

  }

  createItemsOnList(itemsDisplayed: any[]) {
    this.componentsCreatedList = [];
    this.removeAllComponentsOnView();

    for (let index = 0; index < itemsDisplayed.length; index++) {

      let componentCreated;
      if (this.isSelectable == true) {
        componentCreated = this.target.createComponent(SelectableCardComponent).instance;
      } else {
        componentCreated = this.target.createComponent(DefaultCardComponent).instance;
      }

      this.componentsCreatedList.push(componentCreated);

      componentCreated.columnsQuantity = this.columnsQuantity;
      componentCreated.userConfig = this.userConfig;
      componentCreated.itemDisplayed = itemsDisplayed[index];

      componentCreated.displayedfieldsName = this.displayedfieldsName;
      componentCreated.fieldsType = this.fieldsType;
      componentCreated.className = this.className;

      if (this.isSelectable == true) {
        this.selectableFieldController(componentCreated);
        componentCreated.isEditable = this.isAbleToEdit;
        componentCreated.eventClickToEdit.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => { this.goToEditPage(data) });
      } else {
        componentCreated.eventClick.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => { this.goToEditPage(data) });
      }
    }

  }

  editItem(item) {
    this.goToEditPage(item);
  }

  // selectItem(item, isSelected){

  //   const dataIsSelected: boolean = this.selectedItems.some(_item => _item === item);

  //   if (this.selectedItems.length == this.itemsDisplayed.length - 1) {
  //     this.selectAllCheckBox = true;
  //   }

  //   if (dataIsSelected == false) {

  //     if (this.selectedItemsLimit != null) {
  //       if (this.selectedItems.length < this.selectedItemsLimit) {
  //         this.selectedItems.push(item);
  //         // componentCreated.isSelected = true;
  //       }
  //     } else {
  //       this.selectedItems.push(item);
  //       // componentCreated.isSelected = true;
  //     }

  //   } else {
  //     if (this.selectAllCheckBox == true) {
  //       this.selectAllCheckBox = false;
  //     }
  //     this.selectedItems = this.selectedItems.filter(_item => _item !== item);
  //     // componentCreated.isSelected = false;
  //   }

  // }

  // getSelected(item){
  //   console.log(item);
  //   const dataIsSelected: boolean = this.selectedItems.some(_item => _item === item);
  //   if(dataIsSelected){
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }


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

  handlePageEvent($event) {

    let firstlItemToDisplayIndex: number = $event.pageIndex * $event.pageSize;//0
    let lastItemToDisplayIndex: number = firstlItemToDisplayIndex + $event.pageSize;//10 + 25 = 35

    if (lastItemToDisplayIndex > this.itemsDisplayed.length) lastItemToDisplayIndex = this.itemsDisplayed.length;

    const itemsToDisplay = this.itemsDisplayed.slice(firstlItemToDisplayIndex, lastItemToDisplayIndex);
    this.createItemsOnList(itemsToDisplay);

    //Regra para após de instanciar os cards pra nova pagina, verifique se os cards foram selecionados, para marcar eles
    if (this.isSelectable == true) {
      itemsToDisplay.forEach((item, index) => {
        const dataIsSelected: boolean = this.selectedItems.some(_item => _item === item);
        if (dataIsSelected == true) {
          this.componentsCreatedList[index].isSelected = true;
        }
      });
    }
  }

  removeAllComponentsOnView() {
    if (this.target == null) console.warn("target é null");
    this.target.clear();
  }

  getInstanceVariableValue(instance, variableName: string) {
    return instance[variableName]
  }

  goToEditPage(data) {
    const apiUrlSegments = this.apiUrl.split("/");
    this.router.navigate([apiUrlSegments[apiUrlSegments.length - 1] + "/" + data.id + "/edit"]);
  }

  onSelectedItemsCheckBoxChange(event) {
    this.selectAllCheckBox = event.checked;
    if (event.checked == true) {
      this.selectAllItems();
    } else {
      this.unSelectAllItems();
    }
  }

  selectAllItems() {
    this.selectedItems = this.itemsDisplayed;
    this.checkAllItems();
  }

  unSelectAllItems() {
    this.selectedItems = [];
    this.unCheckAllItems();
  }

  checkAllItems() {
    if (this.componentsCreatedList == null) return;

    this.componentsCreatedList.forEach(component => {
      component.isSelected = true;
    })
  }

  unCheckAllItems() {
    if (this.componentsCreatedList == null) return;

    this.componentsCreatedList.forEach(component => {
      component.isSelected = false;
    })
  }

  requestAllValuesFromAPI(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  /**
   * Função que removerá os itens selecionados da lista e atualizará os itens da lista com os itens da API.
   * @returns retorna os itens que foram removidos.
   */
  deleteSelectedItens(): any[] {

    //Eu tenho que fazer alguma forma de ele pegar a apiUrl e os IDs dos itens que estão na lista e foram selecionados para remover todos

    if(this.selectedItems.length <= 0){
      return;
    }

    this.selectedItems.forEach((item)=>{
      this.http.delete(this.apiUrl+'/'+item.id).subscribe({
        error: (error) => alert(this.translocoService.translate("Alerts.deleteErrorMessage")),
      }).unsubscribe();
    });

    this.selectedItems = [];

    alert(this.translocoService.translate("Alerts.deleteSuccessMessage"));

    this.getData(this.apiUrl);

    return this.selectedItems;
  }

  return(){
    if(this.matDialogComponentRef == null) return;

    this.matDialogComponentRef.close();
  }
}
