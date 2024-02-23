import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemBase } from 'app/shared/models/item-base.module';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { BaseResourceFilterComponent } from '../filter/base-resource-filter/base-resource-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'search-input-field',
  templateUrl: './search-input-field.component.html',
  styleUrls: ['./search-input-field.component.scss']
})
export class SearchInputFieldComponent implements AfterViewInit, OnDestroy {
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
   * Link completo no qual é capaz de obter as instâncias dessa classe no banco de dados.\
   * Exemplo: "https://siteDoProgramador.com/api/carros"
   */
  @Input() apiUrl: string;
  /**
   * Chamará a função responsável por limpar tudo que estiver na lista.
   */
  @Output() removeAllComponentsOnViewFunction: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Chamará a função responsável por criar os itens na lista
   */
  @Output() returnedItemsToCreate: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Campos pelo qual será realizada a busca no campo de buscas.\
   * Exemplo: ['name','phone'].
   */
  @Input() searchableFields: string[] | null = null;
  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  searchInputValue = new FormControl<string | null>(null);

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
  ) {}

  ngAfterViewInit(): void {
    this.searchOnAPIEachInputFieldValueChanges(this.searchInputValue, this.apiUrl, this.searchableFields);
  }

  searchOnAPIEachInputFieldValueChanges(searchInput: FormControl<string | null>, apiURL: string, searchableFields: string[]) {
    searchInput.valueChanges.pipe(
      debounceTime(1000),
      switchMap(async (value: string) => {
        if (value == null || value.length <= 0) {
          this.requestAllValuesFromAPI(apiURL).pipe(takeUntil(this.ngUnsubscribe)).subscribe((itemsReturned) => {

            if (itemsReturned.length == 0) this.returnedItemsToCreate.emit(null);
            this.removeAllComponentsOnViewFunction.emit(true);
            this.returnedItemsToCreate.emit(itemsReturned);
          });
        } else {
          await this.search(searchableFields, value, apiURL)
        }
      })
    ).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => { });
  }

  openFilter(apiUrl: string, displayedfieldsName: any[], fieldsType: string[]) {
    const itemBaseStructure: ItemBase[] = [];

    if (displayedfieldsName.length != fieldsType.length) {
      console.error("Tipos da classe faltantes");
      return;
    }

    for (let index = 0; index < displayedfieldsName.length; index++) {
      itemBaseStructure.push({ name: displayedfieldsName[index], type: fieldsType[index] })
    }

    this.openFilterOnDialog(apiUrl, itemBaseStructure);
  }

  openFilterOnDialog(apiUrl: string, itemBaseStructure: ItemBase[]) {

    const dialogRef = this.dialog.open(BaseResourceFilterComponent, {
      height: '80vh',
      width: '80vw',
      data: {
        itemBaseStructure: itemBaseStructure
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(filterParameters => {
      this.requestValuesFromAPIWithSearchParametersFromFilter(apiUrl, filterParameters).pipe(takeUntil(this.ngUnsubscribe)).subscribe((itemsReturned: any[]) => {
        if (itemsReturned.length == 0) return null;

        this.removeAllComponentsOnViewFunction.emit(true);
        this.returnedItemsToCreate.emit(itemsReturned);
      });

    });

    dialogRef.disableClose = true;

  }

  search(searchableFields: string[] | null, searchInputValue: string, apiUrl: string) {
    searchableFields = ["variationCode"];
    if (searchableFields == null) return;
    if (searchInputValue == null) return;

    const filterParameters = this.createSeachParameters(searchableFields, searchInputValue);

    if (filterParameters == null) return null;
    if(filterParameters.filterValues.length == 0) return null;

    this.requestValuesFromAPIWithSearchParametersFromFilter(apiUrl, filterParameters).pipe(takeUntil(this.ngUnsubscribe)).subscribe((itemsReturned: any[]) => {
      if (itemsReturned.length == 0) return;

      this.removeAllComponentsOnViewFunction.emit(true);
      this.returnedItemsToCreate.emit(itemsReturned);
    });
  }

  createSeachParameters(searchableFields: string[], searchInputValue: string) {
    var filterValues = [];
    var conditions = [];

    const sentences: string[] = this.splitStringIntoArray(searchInputValue);

    var index: number = 0;

    searchableFields.forEach((field) => {
      sentences.forEach((sentence) => {
        index++;
        filterValues.push({
          "filterParameter": {
            "parameter": "contains",
            "value": sentence
          },
          "variableInfo": {
            "name": field,
            "type": "string"
          }
        },);
        if (index > 1) {
          conditions.push("or");
        }
      });

    });

    if (filterValues.length == 0) return null;

    var filterParameters = { filterValues, conditions };

    return filterParameters;
  }

  splitStringIntoArray(sentence: string): string[] {
    const words: string[] = sentence.split(' ');

    // Filtering out empty words resulting from extra spaces
    const filteredWords: string[] = words.filter(word => word !== '');

    return filteredWords;
  }

  requestValuesFromAPIWithSearchParametersFromFilter(apiUrl: string, filterParameters): Observable<any> {
    return this.httpClient.post(apiUrl + "/custom", filterParameters);
  }

  requestAllValuesFromAPI(apiUrl: string): Observable<any> {
    return this.httpClient.get(apiUrl);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
