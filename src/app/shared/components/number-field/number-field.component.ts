import { Component, Injector, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
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
export class NumberFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy, OnChanges {

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
  displayedLabel: string;

  public inputValue = new FormControl<string | number | null>(null);
  private ngUnsubscribe = new Subject();
  public errorMessage: string = ''; // Para exibir a mensagem de erro

  constructor(protected injector: Injector, private dialog: MatDialog){
    super(injector);
  }

  ngOnInit(): void {
    this.getDefaultValue();
    this.setLabel();
    this.checkConditional();
    this.setIconPhone();
    this.checkValue();
  }

  ngOnChanges(): void {
    this.checkValue();
  }
// Inside your component

checkValue() {
  // Update value and validity before applying the validator
  this.inputValue.updateValueAndValidity();
  
  // Check if the maskType is 'double'
  if (this.maskType?.toLowerCase() === 'double') {
    // Set the validator to ensure the value is a valid double (with decimal point)
    this.inputValue.setValidators([
      Validators.pattern(/^[-+]?[0-9]+\.[0-9]+$/)  // This ensures a decimal point is required
    ]);
  } else {
    // If not 'double', clear the validators
    this.inputValue.clearValidators();
  }

  // Manually update validity after setting the validators
  this.inputValue.updateValueAndValidity();
}


validateInput(): boolean {
  // Update and check validity of the form control
  this.inputValue.updateValueAndValidity();
  
  // Return whether the input is valid
  return this.inputValue.valid;
}

onSave() {
  if (this.validateInput()) {
    // Proceed with saving the value if valid
    console.log('Saving value:', this.inputValue.value);
  } else {
    // Show an error message if invalid
    console.log('Invalid input, cannot save');
    this.errorMessage = 'Please enter a valid decimal number.';
  }
}

  

  checkConditional() {
    if (this.conditionalVisibility) {
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
      this.svgIcon = 'phone'; // Defina o ícone de telefone do Material Icons aqui
      this.actionOnClickInIcon = () => {
        const phone = this.inputValue.value;
        if (phone) {
          window.location.href = `tel:${phone}`;
        }
      };
    } else {
      this.svgIcon = 'calculate'; // Ícone de calculadora do Material Icons
      this.actionOnClickInIcon = () => {
        this.openCalculatorDialog();
      };
    }
  }

  setLabel() {
    this.setTranslation(this.className, this.label).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (translatedLabel: string) => {
        if(translatedLabel === (this.className + "." + this.label)){
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

  setIconPosition(): string {
    if (!this.svgIcon) return;
    if (this.iconPosition === "end" || this.iconPosition === "start") {
      return this.iconPosition;
    }
    return "end";
  }

  getDefaultValue() {
    if (this.defaultValue != null) {
      this.inputValue.setValue(this.defaultValue);
    }
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
