import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemBase } from 'app/shared/models/item-base.module';
import { Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

interface DateFiltersOptions {
  value: string
}

@Component({
  selector: 'filter-period',
  templateUrl: './filter-period.component.html',
  styleUrls: ['./filter-period.component.scss']
})
export class FilterPeriodComponent implements OnInit, OnDestroy {

  @Output() newDateEvent = new EventEmitter<{ parameter: string, value: Date | { start: Date, end: Date } | number }>();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  selectedDate = new FormControl<Date | null>(null);

  selectedDateNumeric = new FormControl<number | null>(null);

  @Input() variables: ItemBase[];

  dateFiltersOptions: DateFiltersOptions[] = [
    { value: "day" },
    { value: "month" },
    { value: "year" },
    { value: "week" },
    { value: "completeDate" },
    { value: "equal" },
    { value: "different" },
    { value: "afterThan" },
    { value: "afterOrEqualThan" },
    { value: "beforeThan" },
    { value: "beforeOrEqualThan" },
    { value: "between" }
  ]

  selectedDateFiltersOption = new FormControl<string>(this.dateFiltersOptions[0][0]);

  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.onValueChangesInDateRange();
    this.onValueChangesInDate();
    this.onValueChangesInSelectedFilter();
    this.onValueChangesInSelectedDateNumeric();
  }

  onValueChangesInDateRange() {
    this.range.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((newDate: { start: Date, end: Date }) => {
      this.newDateEvent.emit({ parameter: this.selectedDateFiltersOption.value, value: newDate });
    });
  }

  onValueChangesInDate() {
    this.selectedDate.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((newDate: Date) => {
      this.newDateEvent.emit({ parameter: this.selectedDateFiltersOption.value, value: newDate });
    });
  }

  onValueChangesInSelectedFilter() {
    this.selectedDateFiltersOption.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((newParameter: string) => {
      if (newParameter == "between") {
        this.newDateEvent.emit({ parameter: newParameter, value: null })
      } else {
        this.newDateEvent.emit({ parameter: newParameter, value: null })
      }
    });
  }

  onValueChangesInSelectedDateNumeric() {
    this.selectedDateNumeric.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((newDate: number) => {
      if (this.inputFieldIsNumeric() == true) {
        this.newDateEvent.emit({ parameter: this.selectedDateFiltersOption.value, value: newDate });
      }
    });
  }

  inputFieldIsNumeric(): boolean {
    const numericFilterOptions = ['day', 'month', 'year', 'week'];
    if (numericFilterOptions.includes(this.selectedDateFiltersOption.value) == true) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
