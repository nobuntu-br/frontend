import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemBase } from 'app/shared/models/item-base.module';
import { Subject, takeUntil } from 'rxjs';

interface TextFiltersOptions {
  value: string
}

enum TextFiltersOptionsEnum {
  equal,
  different,
  startWith,
  endWith,
  contains,
  dontContains,
  match
}


@Component({
  selector: 'app-filter-text',
  templateUrl: './filter-text.component.html',
  styleUrls: ['./filter-text.component.scss']
})
export class FilterTextComponent implements OnInit, OnDestroy {
  @Input() variables: ItemBase[];
  @Output() newTextEvent = new EventEmitter<{ parameter: string, value: string }>();

  textFiltersOptions: TextFiltersOptions[] = [
    { value: "equal" },
    { value: "different" },
    { value: "startWith" },
    { value: "endWith" },
    { value: "contains" },
    { value: "dontContains" },
    { value: "match" }
  ]

  searchableText = new FormControl<string>('');

  selectedTextFiltersOptions = new FormControl<string>(this.textFiltersOptions[0][0]);
  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  ngOnInit(): void {
    this.onChangeSearchableText();
    this.onChangeInSelectedFilter();
  }

  onChangeSearchableText() {
    this.searchableText.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((newValue: string) => {
      this.verifyConditionToSendValues(this.selectedTextFiltersOptions.value, newValue);
    });
  }

  onChangeInSelectedFilter() {
    this.selectedTextFiltersOptions.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((newParameter: string) => {
      this.verifyConditionToSendValues(newParameter, this.searchableText.value);
    });
  }

  verifyConditionToSendValues(parameter: string, value: string) {
    if (value.length > 0) {
      this.newTextEvent.emit({ parameter: parameter, value: value });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
