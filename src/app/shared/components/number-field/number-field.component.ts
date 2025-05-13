import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CalculatorComponent } from '../calculator/calculator.component';

@Component({
  selector: 'number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss']
})
export class NumberFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {

  @Input() className: string;
  @Input() label: string;
  @Input() charactersLimit: number;
  @Input() placeholder: string = "";
  @Input() mask: string;
  @Input() maskType: string;
  @Input() svgIcon: string | null = "heroicons_solid:calculator";
  @Input() isRequired: boolean = false;
  @Input() iconPosition: string = "end";
  @Input() defaultValue: string | number | null = null;
  @Input() actionOnClickInIcon: () => void = null;
  @Input() conditionalVisibility: { field: string, values: string[] }
  @Input() resourceForm: FormGroup<any>;
  @Input() limiteOfChars: number; // criado novo
  @Input() numberOfDecimals: number; // criado novo
  @Input() decimalSeparator: string; // criado novo

  displayedLabel: string;

  public inputValue = new FormControl<string | number | null>(null);
  private ngUnsubscribe = new Subject();
  public errorMessage: string = '';
  private inputSubscription: any = null;
  valueForSaving: any;
  

  constructor(protected injector: Injector, private dialog: MatDialog) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDefaultValue();
    this.setLabel();
    this.checkConditional();
    this.setIconPhone();
    this.setupMaskAndListener();
    this.checkCharacterLimit(); 
  }

  checkCharacterLimit() {
    if (this.limiteOfChars) {
      this.inputValue.setValidators([
        ...this.inputValue.validator ? [this.inputValue.validator] : [],
        (control: FormControl) => {
          const value = control.value || '';
          const valueString = value.toString().trim(); 
          const separatorIndex = valueString.indexOf(this.decimalSeparator || '.');
          const limitedChars = this.limiteOfChars+this.numberOfDecimals+1; 
          const integerPart = separatorIndex !== -1 ? valueString.substring(0, separatorIndex) : valueString;
  
          return integerPart.length <= limitedChars
            ? null
            : { characterLimitExceeded: true };
        }
      ]);
      this.inputValue.updateValueAndValidity(); 
    }
  }

  getDefaultValue() {
    if (this.defaultValue != null) {
      this.inputValue.setValue(this.defaultValue);
    }
  }

  setLabel() {
    this.setTranslation(this.className, this.label).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (translatedLabel: string) => {
        if (translatedLabel === (this.className + "." + this.label)) {
          const formattedLabel = this.formatDefaultVariableName(this.label);
          this.displayedLabel = this.setCharactersLimit(formattedLabel, this.charactersLimit);
        } else {
          this.displayedLabel = this.setCharactersLimit(translatedLabel, this.charactersLimit);
        }
      },
      error: () => {
        this.displayedLabel = this.setCharactersLimit(this.label, this.charactersLimit);
      },
    });
  }

  checkConditional() {
    if (this.conditionalVisibility) {
      let initialFieldValue = this.resourceForm.get(this.conditionalVisibility.field)?.value;
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
        if (this.inputValue.enabled) {
          this.inputValue.disable();
        }
      }

      this.resourceForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formValues => {
        let fieldValue = formValues[this.conditionalVisibility.field];
        if (fieldValue && typeof fieldValue === 'object' && fieldValue.id) {
          fieldValue = fieldValue.id;
        }
        const fieldValueStr = fieldValue?.toString();
        if (this.conditionalVisibility.values.includes(fieldValueStr)) {
          if (this.inputValue.disabled) {
            this.inputValue.enable();
          }
        } else {
          if (this.inputValue.enabled) {
            this.inputValue.disable();
          }
        }
      });
    }
  }
  
  setIconPhone() {
    if (this.maskType?.toLowerCase() === 'phone') {
      this.svgIcon = 'phone';
      this.actionOnClickInIcon = () => {
        const phone = this.inputValue.value;
        if (phone) {
          window.location.href = `tel:${phone}`;
        }
      };
    } else {
      this.svgIcon = 'calculate';
      this.actionOnClickInIcon = () => {
        this.openCalculatorDialog();
      };
    }
  }

  setupMaskAndListener() {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }

    this.inputSubscription = this.inputValue.valueChanges.subscribe(value => {
      if (value) {
        const invalidChar = this.decimalSeparator === ',' ? '.' : ',';
        let corrected = value.toString();

        if (corrected.includes(invalidChar)) {
          corrected = corrected.replace(invalidChar, this.decimalSeparator);
        }

        let valueForSaving = corrected.replace(this.decimalSeparator, '.');

        const numericValue = parseFloat(valueForSaving);
        if (!isNaN(numericValue) && this.numberOfDecimals != null) {
          const factor = Math.pow(10, this.numberOfDecimals);
          const roundedValue = Math.round(numericValue * factor) / factor;
          valueForSaving = roundedValue.toFixed(this.numberOfDecimals);
        }


        this.valueForSaving = valueForSaving;
      }
    });
  }

  applyFinalFormatting() {
    if (this.valueForSaving != null) {
      this.inputValue.setValue(this.valueForSaving, { emitEvent: false });
    }
  }

  validateInput(): boolean {
    this.inputValue.updateValueAndValidity();
    return this.inputValue.valid;
  }

  setIconPosition(): string {
    if (!this.svgIcon) return;
    if (this.iconPosition === "end" || this.iconPosition === "start") {
      return this.iconPosition;
    }
    return "end";
  }

  openCalculatorDialog() {
    const dialogRef = this.dialog.open(CalculatorComponent, {
      data: { formData: this.inputValue.value }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result !== undefined && result !== null && result !== '') {
        this.inputValue.setValue(result.toString());
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}