import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DefaultListComponent, IDefaultListComponentDialogConfig } from '../default-list/default-list.component';
import { Subject, take, takeUntil } from 'rxjs';
import { SelectedItemsListComponent } from '../selected-items-list/selected-items-list.component';
import { DinamicBaseResourceFormComponent, IDinamicBaseResourceFormComponent } from '../dinamic-base-resource-form/dinamic-base-resource-form.component';

enum ISelectionOption {
  add,
  set
}

@Component({
  selector: 'app-foreign-key-input-field',
  templateUrl: './foreign-key-input-field.component.html',
  styleUrls: ['./foreign-key-input-field.component.scss']
})

export class ForeignKeyInputFieldComponent implements OnDestroy, AfterViewInit {
  /**
   * Titulo apresentado em cima do campo de inserção de dados
   */
  @Input() label: string;
  /**
   * Quantidade máxima de letras.\
   * Exemplo: 255.
   */
  @Input() charactersLimit: number;
  /**
   * Texto que é apresentado caso o campo esteja vazio.\
   * Exemplo: "Insira o valor aqui".
   */
  @Input() placeholder: string = "";
  /**
   * Ícone svg para ser apresentado no campo.
   */
  @Input() svgIcon: string | null;
  /**
   * É preciso preencher o campo.\
   * Exemplo: true.
   */
  @Input() isRequired: boolean = false;
  /**
   * Define qual variável será usada para ser apresentado no campo de inserção.
   * @example "name"
   */
  @Input() fieldDisplayedInLabel: string;
  /**
   * Nome da classe na qual a variável desse componente pertence.
   * @example "Produtos"
   */
  @Input() className: string | null;
  /**
   * Nome da variável desse componente no formulário
   * @example "detalhes"
   */
  @Input() fieldName: string | null;
  /**
   * Dados que orientam a criação da pagina
   */
  @Input() dataToCreatePage: object | null;
  @Input() value: any;
  /**
   * Campo no formulário que receberá os dados dos valores selecionados.
   */
  public inputValue: FormControl<object[]> = new FormControl<object[]>([]);
  /**
   * Valor que será apresentado no campo de preenchimento.
   * Como é uma chave estrangeira, apresentar o ID do item não é algo apresentável para o usuário.
   * @var fieldDisplayedInLabel Variável que definirá qual atributo da classe será apresentado.
   */
  displayedValue: string[] = [""];
  /**
   * Quantitade máxima de valores que podem ser selecionados.
   * @example "1"
   * Por padrão é 1
   */
  selectedItemsLimit: number = 1;
  /**
   * Define se os itens serão armazenados em array ou é um objeto.
   */
  isObjectStoredInArray: boolean = false;
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
  ) { }

  ngAfterViewInit(): void {
    this.inputValue.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (data) => {
        this.setDisplayedValue(this.inputValue, this.fieldDisplayedInLabel);
      }
    })
  }

  /**
   * Função responsável por definir as informações que serão apresentadas no campo de inserção do componente atual
   * @param inputValue FormControl que armazena os valores do formulário
   * @param valueDisplayed Valores que são apresentados no campo de inserção do componente atual
   */
  setDisplayedValue(inputValue: FormControl, valueDisplayed: string) {
    //Se não tiver nada ele só define vazio no campo apresentável
    if (inputValue.value == null || inputValue.value.length == 0) {
      this.displayedValue = [""];
      return;
    };

    //Verifica se o item contido na FormControl é um array
    if (inputValue.value instanceof Array) {
      if (inputValue.value[0].hasOwnProperty(valueDisplayed) == false) {
        valueDisplayed = "id";
      }

      this.displayedValue = inputValue.value.map(value => value[valueDisplayed]);

    } else {
      //Caso não for array
      if (inputValue.value[valueDisplayed] == undefined) {
        valueDisplayed = "id";
      }
      this.displayedValue = inputValue.value[valueDisplayed];
    }
  }

  openDefaultListToSelectItems() {

    const config: IDefaultListComponentDialogConfig = {
      itemsDisplayed: [],
      columnsQuantity: 3,
      displayedfieldsName: this.value.propertiesAttributes.map(attribute => attribute.name),
      fieldsType: this.value.propertiesAttributes.map(attribute => attribute.type),
      objectDisplayedValue: this.value.propertiesAttributes.map(attribute => attribute.displayedfieldsName),//TODO ver se funciona
      userConfig: null,
      selectedItemsLimit: this.selectedItemsLimit,
      apiUrl: this.value.apiUrl,
      searchableFields: null,
      isSelectable: true,
      className: this.fieldName,//É fieldName pois aqui será editado a campo que está na classe do ClasNa
      isAbleToCreate: false,
      isAbleToEdit: false,
      isAbleToDelete: true,
      dataToCreatePage: this.dataToCreatePage,
      useFormOnDialog: true,
      isEnabledToGetDataFromAPI: true
    }

    const dialogRef = this.matDialog.open(DefaultListComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: config,
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.selectItems(result, ISelectionOption.set);

    });

    dialogRef.disableClose = true;

  }


  openSelectableItemsListDialogToEditItems() {

    const config: IDefaultListComponentDialogConfig = {
      itemsDisplayed: this.inputValue.value,
      columnsQuantity: 2,
      displayedfieldsName: this.value.propertiesAttributes.map(attribute => attribute.name),
      fieldsType: this.value.propertiesAttributes.map(attribute => attribute.type),
      objectDisplayedValue: this.value.propertiesAttributes.map(attribute => attribute.displayedfieldsName),//TODO ver se funciona
      userConfig: null,
      selectedItemsLimit: this.selectedItemsLimit,
      apiUrl: this.value.apiUrl,
      searchableFields: null,
      isSelectable: true,
      className: this.fieldName,
      isAbleToCreate: false,
      isAbleToEdit: true,
      isAbleToDelete: true,
      dataToCreatePage: this.dataToCreatePage,
      useFormOnDialog: true,
      isEnabledToGetDataFromAPI: false
    }

    // const dialogRef = this.matDialog.open(SelectedItemsListComponent, {
    const dialogRef = this.matDialog.open(DefaultListComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: config
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      // console.log("O retorno do edit foi:", result);
      if (result == null) return;
      this.selectItems(result, ISelectionOption.set);
    });
  }

  /**
   * Função que irá remover os itens que foram selecionados.
   */
  removeItensOnInputField() {
    this.inputValue.setValue([]);
    this.displayedValue = [''];
  }


  /**
   * Abre um dialog com um formuário que permite a edição do item;
   * @param data Dados do item a ser criado ou editado. Se for null ele só criará.
   */
  openFormDialogToCreateItem(currentAction: string, data?) {

    const config: IDinamicBaseResourceFormComponent = {
      dataToCreatePage: this.dataToCreatePage,
      className: this.fieldName,
      itemId: data?.id,
      currentAction: currentAction,
    }

    console.log("Dados para abertura do formulário de criação: ", config);

    const dialogRef = this.matDialog.open(DinamicBaseResourceFormComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: config,

    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(item => {
      if (item == null) return;

      if ('action' in item) {
        return;
      }

      this.selectItems([item], ISelectionOption.set);
    });

  }

  /**
   * Função que faz o controle da seleção de itens, controlando o limite.
   * @param newItems Array com itens que serão selecionados.
   * @param selectionOption Se ele irá adicionar mais itens ou irá substituir os itens.
   * @example "ISelectionOption.add" irá adicionar mais itens na seleção o "ISelectionOption.set" irá substituir os itens da seleção
   */
  selectItems(newItems: any[], selectionOption: ISelectionOption) {
    if (newItems == null) return;

    let currentSelectedItensQuantity: number = 0;

    if (this.inputValue.value == null) {
      currentSelectedItensQuantity = 0;
    } else {
      currentSelectedItensQuantity = this.inputValue.value.length;
    }

    if (selectionOption == ISelectionOption.add) {

      if (currentSelectedItensQuantity + newItems.length > this.selectedItemsLimit) return;

      //Se já tiver item selecionado ele 
      if (currentSelectedItensQuantity > 0) {
        //Remove os itens duplicados
        let remainingItems = newItems.filter(item => !this.inputValue.value.includes(item));
        newItems.push(...remainingItems);
      }
    } else if (selectionOption == ISelectionOption.set) {
      if (newItems.length > this.selectedItemsLimit) return;
    }

    // this.inputValue.setValue(newItems);
    this.setNewValueToInput(newItems);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  setNewValueToInput(newItems: object[]) {
    var objectsID: string[] = [];//Armazenará os IDs dos objetos que foram selecinados/adicionados
    var displayedValues: string[] = [];//Valores apresentáveis dos objetos

    for (const obj of newItems) {
      if (obj.hasOwnProperty('id')) {
        objectsID.push(obj["id"]);
      }

      if (obj.hasOwnProperty(this.fieldDisplayedInLabel)) {
        displayedValues.push(obj[this.fieldDisplayedInLabel]);
      }
    }

    this.inputValue.setValue(newItems);
    // console.log("InputValue contém: ",this.inputValue.value);

    this.displayedValue = displayedValues;
    // console.log("displayedValue contém: ",this.displayedValue);
  }

}
