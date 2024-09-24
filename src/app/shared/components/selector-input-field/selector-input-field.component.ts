import { AfterViewInit, Component,Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
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
  
  public inputValue = new FormControl<object[]>([]);
  
  constructor(
    private translocoService: TranslocoService
  ){}

  ngAfterViewInit(): void {
    this.limitSelectedItems();
  }

  /**
   * Limita a quantidade de itens selecionados
   */
  private limitSelectedItems(): void {
    this.inputValue.valueChanges.subscribe((values) => {
      if (values.length > this.selectItemsLimit && this.selectItemsLimit > 1) {
        this.inputValue.setValue(values.slice(0, this.selectItemsLimit));
      }
    });
  }  
}
