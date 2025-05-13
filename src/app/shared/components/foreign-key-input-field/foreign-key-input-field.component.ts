import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DefaultListComponent, IDefaultListComponentDialogConfig } from '../default-list/default-list.component';
import { Subject, take, takeUntil } from 'rxjs';
import { SelectedItemsListComponent } from '../selected-items-list/selected-items-list.component';
import { DinamicBaseResourceFormComponent, IDinamicBaseResourceFormComponent } from '../dinamic-base-resource-form/dinamic-base-resource-form.component';
import { IPageStructure } from 'app/shared/models/pageStructure';
import { environment } from 'environments/environment';
import { FormGeneratorService } from 'app/shared/services/form-generator.service';
import { FormSpaceBuildComponent } from '../form-space-build/form-space-build.component';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

enum ISelectionOption {
  add,
  set
}

@Component({
  selector: 'app-foreign-key-input-field',
  templateUrl: './foreign-key-input-field.component.html',
  styleUrls: ['./foreign-key-input-field.component.scss']
})

export class ForeignKeyInputFieldComponent implements OnDestroy, AfterViewInit, OnInit {
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
  @Input() dataToCreatePage: IPageStructure | null;
  @Input() value: any;
  /**
   * Lista de itens que foram selecionados.
   */
  @Input() index: number;
  /**
  * Condicao de visibilidade do campo.
  */
  @Input() conditionalVisibility: { field: string, values: string[] }
  /**
  * FormGroup do formulario.
  */
  @Input() resourceForm: FormGroup<any>;
  /**
   * Campo no formulário que receberá os dados dos valores selecionados.
   */
  public inputValue: FormControl<object | object[]> = new FormControl<object | object[]>(null);
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
  /**
   * Lista de itens que foram selecionados.
   */
  //resourceForm: any;

  enableToEdit: boolean = false;

  constructor(
    private matDialog: MatDialog,
    private formGeneratorService: FormGeneratorService,
    private http: HttpClient,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.checkConditional();
  }

  checkConditional() {
    if (this.conditionalVisibility) {
      // Verifica o valor inicial
let initialFieldValue = this.resourceForm.get(this.conditionalVisibility.field)?.value;
console.log('Initial field value:', initialFieldValue);
if (initialFieldValue && typeof initialFieldValue === 'object' && initialFieldValue.id) {
  initialFieldValue = initialFieldValue.id;
}
if (initialFieldValue !== null && typeof initialFieldValue !== 'string') {
  initialFieldValue = initialFieldValue.toString();
}
if (this.conditionalVisibility.values.includes(initialFieldValue)) {
  if (this.inputValue.disabled) {
    this.inputValue.enable();
  }
} else {
  if (!this.inputValue.disabled) {
    this.inputValue.disable();
  }
}

// Observa mudanças no valor do resourceForm
this.resourceForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formValues => {
  // Verifica todas as alterações dos campos de input 
  let fieldValue = formValues[this.conditionalVisibility.field];
  // Verifica se o valor é um objeto e pega o id
  if (fieldValue && typeof fieldValue === 'object' && fieldValue.id) {
    fieldValue = fieldValue.id;
  }
  // Transforma em string caso nao seja
  const fieldValueStr = fieldValue?.toString();
  if (this.conditionalVisibility.values.includes(fieldValueStr)) {
    // Caso o valor do fieldValue seja igual a algum de dentro do values ai é habilitado
    if (this.inputValue.disabled) {
      this.inputValue.enable();
    }
  } else {
    if (!this.inputValue.disabled) {
      this.inputValue.disable();
    }
  }
});
    }
  }

  ngAfterViewInit(): void {
    if (this.inputValue.value != null) {
      this.setDisplayedValue(this.inputValue, this.fieldDisplayedInLabel);
    }
    this.inputValue.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (data) => {
        this.setDisplayedValue(this.inputValue, this.fieldDisplayedInLabel);
      }
    });
  
    // Verifica a condição de visibilidade após a inicialização da visualização
    this.checkConditional();
  }

  /**
   * Função responsável por definir as informações que serão apresentadas no campo de inserção do componente atual
   * @param inputValue FormControl que armazena os valores do formulário
   * @param valueDisplayed Valores que são apresentados no campo de inserção do componente atual
   */
  setDisplayedValue(inputValue: FormControl, valueDisplayed: string) {
    var searchableProperty: string;
    var hasProperty: boolean;

    //Se não tiver nada ele só define vazio no campo apresentável
    if (inputValue.value == null || inputValue.value.length == 0) {
      this.displayedValue = [""];
      this.enableToEdit = false;
      return;
    };
    this.enableToEdit = true;

    //Verifica se o item contido na FormControl é um array
    if (inputValue.value instanceof Array) {
      hasProperty = inputValue.value.some(obj => obj.hasOwnProperty(valueDisplayed) == true);
    } else {
      hasProperty = inputValue.value.hasOwnProperty(valueDisplayed)
    }

    if (hasProperty == true) {
      searchableProperty = this.fieldDisplayedInLabel;
    } else {
      if (inputValue.value instanceof Array) {
        searchableProperty = this.getFirstNonIdKey(inputValue.value[0]);
      } else {
        searchableProperty = this.getFirstNonIdKey(inputValue.value);
      }
    }

    //Verifica se o item contido na FormControl é um array
    if (inputValue.value instanceof Array) {

      var _displayedValues;

      for (const obj of inputValue.value) {

        _displayedValues.push(obj[searchableProperty]);

      }

      this.displayedValue = _displayedValues;

    } else {
      this.displayedValue = inputValue.value[searchableProperty];
    }
  }

  openDefaultListToSelectItems() {

    const config: IDefaultListComponentDialogConfig = {
      itemsDisplayed: [],
      columnsQuantity: 3,
      displayedfieldsName: this.value.propertiesAttributes.map(attribute => attribute.name),
      fieldsType: this.value.propertiesAttributes.map(attribute => attribute.type),
      objectDisplayedValue: this.value.propertiesAttributes.map(attribute => attribute.fieldDisplayedInLabel),//TODO ver se funciona
      userConfig: null,
      selectedItemsLimit: this.selectedItemsLimit,
      apiUrl: this.value.apiUrl,
      searchableFields: this.dataToCreatePage.config.searchableFields,
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
      // width: '100%',
      // height: '100%',
      maxWidth: '100vw',
      maxHeight: '80vh',
      panelClass: 'full-screen-dialog',
      data: config,
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.selectItems(result, ISelectionOption.set);

    });

    dialogRef.disableClose = true;

  }


  openSelectableItemsListDialogToEditItems() {

    var items: Object[] | object;
    if (this.inputValue.value instanceof Array == false) {
      items = [this.inputValue.value];
    } else {
      items = this.inputValue.value;
    }

    const config: IDefaultListComponentDialogConfig = {
      itemsDisplayed: items,
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

    const dialogRef = this.matDialog.open(DefaultListComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: config
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result == null) return;
      this.selectItems(result, ISelectionOption.set);
    });
  }

  /**
   * Função que irá remover os itens que foram selecionados.
   */
  removeItensOnInputField() {
    this.inputValue.setValue(null);
    this.displayedValue = [null];
  }

  /**
   * Abre o formulário em popUp/dialog tanto para criação.
   */
  openFormDialogToCreateItem() {
    let nameClass = this.dataToCreatePage.attributes[this.index].className;
    nameClass = nameClass.charAt(0).toLowerCase() + nameClass.slice(1);

    let jsonPath = environment.jsonPath + nameClass + ".json";

    this.formGeneratorService.getJSONFromDicionario(jsonPath).pipe(takeUntil(this.ngUnsubscribe)).subscribe((JSONDictionary: any) => {

      const dialogRef = this.matDialog.open(FormSpaceBuildComponent, {
        id: this.dataToCreatePage.attributes[this.index].className + '-form-dialog',
        maxHeight: '95vh', // Altura máxima de 90% da tela
        width: '80vw',      // Largura de 80% da tela
        data: {
          dataToCreatePage: JSONDictionary,
          currentFormAction: 'new',
          submitFormFunction: this.submitForm.bind(this),
          formBuilder: this.resourceForm,
          returnFormFunction: () => {
            dialogRef.close();
          }
        }
      })
    });
  }

  submitForm(JSONDictionary: IPageStructure, item: FormGroup) {
    if (item == null) return;

    if (item.invalid) {
      item.markAllAsTouched();
      this.matSnackBar.open("Preencha todos os campos obrigatórios", "Fechar", {
        duration: 5000
      });
      return;
    }

    item = item.value;
    item = this.objectTratament(item);
    this.inputValue.setValue(item);
    this.matDialog.getDialogById(this.dataToCreatePage.attributes[this.index].className + '-form-dialog')?.close();
    this.displayedValue = [item[this.fieldDisplayedInLabel]];
    console.log(this.inputValue.value);
  }

  /**
 * Realizar uma alteração nos dados do formulário, removendo objetos e substituindo somente pelos IDs
 * @param item Formulário
 */
  objectTratament(item) {
    for (let field in item) {
      if (item[field] instanceof Object) {
        if (item[field] instanceof Array) {
          item[field] = item[field].map((value) => value.id == undefined || value.id == null ? value : value.id);
        } else {
          if (item[field].id == undefined || item[field].id == null) {
            continue;
          }
          item[field] = item[field].id;
        }
      }
    }
    return item;
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
      currentSelectedItensQuantity = Array.isArray(this.inputValue.value) ? this.inputValue.value.length : 0;
    }

    if (selectionOption == ISelectionOption.add) {

      if (currentSelectedItensQuantity + newItems.length > this.selectedItemsLimit) return;

      //Se já tiver item selecionado ele 
      if (currentSelectedItensQuantity > 0) {
        //Remove os itens duplicados
        let remainingItems = newItems.filter(item => !Array.isArray(this.inputValue.value) || !this.inputValue.value.includes(item));
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
    //var objectsID: string[] = [];//Armazenará os IDs dos objetos que foram selecinados/adicionados
    var displayedValues: string[] = [];//Valores apresentáveis dos objetos
    var searchableProperty: string;

    const hasProperty = newItems.some(obj => obj.hasOwnProperty(this.fieldDisplayedInLabel) == true);

    if (hasProperty == true) {
      searchableProperty = this.fieldDisplayedInLabel;
    } else {
      searchableProperty = this.getFirstNonIdKey(newItems[0]);
    }

    if (newItems.length == 1) {
      this.inputValue.setValue(newItems[0]);
      this.displayedValue = [newItems[0][searchableProperty]];
      return;
    }


    for (const obj of newItems) {

      displayedValues.push(obj[searchableProperty]);

    }

    this.inputValue.setValue(newItems);
    // console.log("InputValue contém: ",this.inputValue.value);

    this.displayedValue = displayedValues;
    // console.log("displayedValue contém: ",this.displayedValue);
  }

  getFirstNonIdKey(obj: Object): string | null {
    const keys = Object.keys(obj);
    for (let key of keys) {
      if (key !== 'id' && key !== '_id') {
        return key;
      }
    }
    return null; // Se não houver nenhuma chave além de 'id'
  }

}
