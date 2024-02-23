import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'filter-boolean',
  templateUrl: './filter-boolean.component.html',
  styleUrls: ['./filter-boolean.component.scss']
})
export class FilterBooleanComponent implements OnInit, OnDestroy {

  @Output() newBooleanEvent = new EventEmitter<{ parameter: string, value: boolean }>();
  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  booleanValues: { value: string }[] = [
    { value: "true" },
    { value: "false" },
  ]

  searchableBoolean = new FormControl<boolean>(false);

  ngOnInit(): void {
    this.onChangeSearchableBoolean();
  }

  onChangeSearchableBoolean() {
    this.searchableBoolean.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((newValue: boolean) => {
      this.verifyConditionToSendValues(newValue);
    });
  }

  verifyConditionToSendValues(value: boolean) {
    if (value != null) {
      this.newBooleanEvent.emit({ parameter: "equal", value: value });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
