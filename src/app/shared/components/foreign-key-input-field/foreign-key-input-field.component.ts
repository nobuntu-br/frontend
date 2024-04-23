import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DefaultListComponent, IDefaultListComponentDialogConfig } from '../default-list/default-list.component';
import { Subject, retry, take, takeUntil } from 'rxjs';
import { SelectedItemsListComponent } from '../selected-items-list/selected-items-list.component';
import { DinamicBaseResourceFormComponent, IDinamicBaseResourceFormComponent } from '../dinamic-base-resource-form/dinamic-base-resource-form.component';
import { distinctUntilChanged } from 'rxjs/operators';


enum ISelectionOption {
  add,
  set
}

@Component({
  selector: 'app-foreign-key-input-field',
  templateUrl: './foreign-key-input-field.component.html',
  styleUrls: ['./foreign-key-input-field.component.scss']
})

export class ForeignKeyInputFieldComponent implements OnDestroy, OnInit {
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
  @Input() fieldDisplayedInLabel: string = "nome";
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
   * Localidade onde o JSON que orienta a criação das paginas se encontra.
   * @example "../../../../assets/dicionario/classe.json"
   */
  @Input() JSONPath: string | null;
  @Input() value: any;
  /**
   * Define se é possivel enviar mais de um valor para o campo.
   * @example "true" ou "false"
  */
  @Input() multiple: boolean = false;
   /**
   * Campo no formulário que receberá os dados dos valores selecionados.
   */
  public inputValue: FormControl<string[] | string> = new FormControl<string[] | string>([]);
  /**
   * Valor que será apresentado no campo de preenchimento.
   * Como é uma chave estrangeira, apresentar o ID do item não é algo apresentável para o usuário.
   * @var fieldDisplayedInLabel Variável que definirá qual atributo da classe será apresentado.
   */
  displayedValue: string[];
  /**
   * Quantitade máxima de valores que podem ser selecionados.
   * @example "1"
   * Por padrão é 1
   */
  selectedItemsLimit: number = 3;
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

  async ngOnInit(): Promise<void> {
    await this.refreshDisplayedValue();
    if(!this.multiple) await this.verifyIfArrayIsUnique(this.inputValue.value);

    this.inputValue.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (data) => {
        if(!this.multiple){
          this.verifyIfArrayIsUnique(this.inputValue.value);
        } 
        this.refreshDisplayedValue();
      },
    });
  }

  openDefaultListToSelectItems() {

    const config: IDefaultListComponentDialogConfig = {
      itemsDisplayed: [],
      columnsQuantity: 3,
      displayedfieldsName: this.value.propertiesAttributes.map(attribute => attribute.name),
      fieldsType: this.value.propertiesAttributes.map(attribute => attribute.type),
      userConfig: null,
      selectedItemsLimit: this.selectedItemsLimit,
      apiUrl: this.value.apiUrl,
      searchableFields: null,
      isSelectable: true,
      className: this.fieldName,//É fieldName pois aqui será editado a campo que está na classe do ClasNa
      isAbleToCreate: false,
      isAbleToEdit: true,
      isAbleToDelete: true,
      JSONPath: this.JSONPath,
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
      userConfig: null,
      selectedItemsLimit: this.selectedItemsLimit,
      apiUrl: this.value.apiUrl,
      searchableFields: null,
      isSelectable: true,
      className: this.fieldName,
      isAbleToCreate: false,
      isAbleToEdit: true,
      isAbleToDelete: true,
      JSONPath: this.JSONPath,
    }

    const dialogRef = this.matDialog.open(SelectedItemsListComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: config
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      console.log("O retorno do edit foi:", result);
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
      JSONPath: this.JSONPath,
      className: this.fieldName,
      itemId: data?.id,
      currentAction: currentAction,
    }

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

    this.inputValue.setValue(newItems);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  /**
   * Essa função irá atualizar os itens que são apresentados no campo de inserção. 
   * Como os valores selecionados por esse componente são objetos, é preciso definir qual variavel desses objetos será apresentada no campo se inserção.
   * Caso o valor passado na variável @var fieldDisplayedInLabel não constar nos objetos selecionados, ele apresentará a primeira variável dos objetos no campo de inserção.
   */
  refreshDisplayedValue() {
    if(this.verifyIfFieldIsEmpyt()) return;
    
    const items: any[] | any = this.inputValue.value;
    var itemsDisplayedValue;
    console.log("items: ",this.fieldDisplayedInLabel);


    const firstItem = items[0];

    if(Array.isArray(items)) {
      if (this.fieldDisplayedInLabel in firstItem) {
        itemsDisplayedValue = items.map(objeto => objeto[this.fieldDisplayedInLabel]); //Obtem os valores com a chave do JSON
      } else {
        // Se a chave especificada não estiver presente, retorna os valores da primeira chave de todos os objetos
        const firstKey = Object.keys(firstItem)[0];
        itemsDisplayedValue = items.map(objeto => objeto[firstKey]);
      }
  
      this.displayedValue = itemsDisplayedValue;
    } 

    if(!Array.isArray(items)) {
      if (this.fieldDisplayedInLabel in items) {
        itemsDisplayedValue = items[this.fieldDisplayedInLabel];
      } else {
        // Se a chave especificada não estiver presente, retorna os valores da primeira chave de todos os objetos
        const firstKey = Object.keys(firstItem)[0];
        itemsDisplayedValue = items[firstKey];
      }
  
      this.displayedValue = [itemsDisplayedValue];
    }

  }

  /**
   * Verifica se o campo está vazio, se estiver ele irá setar o campo para um array vazio.
   * @returns true se o campo estiver vazio, false se não estiver.
   * @example "true" ou "false"
  */
  private verifyIfFieldIsEmpyt(): boolean {
    if (this.inputValue.value.length == 0) {
      this.displayedValue = [''];
      return true;
    }
    return false;
  }

/**
  * Verifica se o array é unico, se for igual a 1 ele irá setar o valor do campo para o primeiro item do array.
  * @param data Array de strings
  */
  private verifyIfArrayIsUnique(data: string[] | string) {
    if (data.length == 1) {
      this.inputValue.setValue(data[0]);
    }
  }

}