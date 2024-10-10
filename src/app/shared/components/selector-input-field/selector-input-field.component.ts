import { AfterViewInit, Component,Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { delay } from 'rxjs/operators';
import { take } from 'rxjs';

export interface ISelectorValue {
  pt: string;
  en: string;
  id: string;
}

@Component({
  selector: 'app-selector-input-field',
  templateUrl: './selector-input-field.component.html',
  styleUrls: ['./selector-input-field.component.scss']
})
export class SelectorInputFieldComponent implements AfterViewInit{
  /**
   * Título que será apresentado no componente
   */
  @Input() label: string;
  @Input() valuesList: ISelectorValue[];
  /**
   * Quantidade limite de itens que podem ser selecionados
   */
  @Input() selectItemsLimit: number;
  
  public inputValue = new FormControl<string | ISelectorValue | ISelectorValue[]>(null);
  constructor(
    private translocoService: TranslocoService
  ){}

  ngAfterViewInit(): void {
    this.limitSelectedItems();
    this.inputValue.valueChanges.pipe(delay(0), take(1)).subscribe(() => {
      this.getDataOnEdit();
    });
    // this.changeLanguage();
  }

  // private changeLanguage(): void {
  //   this.translocoService.langChanges$.subscribe(() => {
  //     if(!this.valueObject) return;
  //     this.inputValue.setValue(this.valueObject[this.translocoService.getActiveLang()]);
  //   });
  // }

  /**
   * Limita a quantidade de itens selecionados
   */
  private limitSelectedItems(): void {
    this.inputValue.valueChanges.subscribe((values) => {
      if(this.inputValue.value === null) return;

      if(this.inputValue.value instanceof Array){
        let selectedValues: Array<any> = this.inputValue.value;
        if (selectedValues.length > this.selectItemsLimit && this.selectItemsLimit > 1) {
          this.inputValue.setValue(selectedValues.slice(0, this.selectItemsLimit));
        }
      }
    });
  } 


  private getDataOnEdit(): void {
    let itens = [];
    if(!this.valuesList) return;
    if (!this.inputValue.value) return;
    this.valuesList.forEach((value) => {
      if (value.id === this.inputValue.value) {
        itens.push(value);
      }
    });

    if (itens.length === 1) {
      let input = itens[0];
      this.inputValue.setValue(input);
    }
    if (itens.length > 1) {
      this.inputValue.setValue(itens);
    }
  }
}
