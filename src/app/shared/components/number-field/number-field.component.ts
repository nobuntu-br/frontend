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
  private inputSubscription: any = null;
  private decimalSeparator: string;


  constructor(protected injector: Injector, private dialog: MatDialog) {
    super(injector);
    this.setDecimalSeparator();
  }

  ngOnInit(): void {
    this.getDefaultValue();
    this.setLabel();
    this.checkConditional();
    this.setIconPhone();
    this.checkValue();

    this.setupMaskAndListener(); // Configura tudo inicialmente
    this.listenToLangChange();   // Escuta mudança de idioma ao vivo// escuta a troca de idioma ao vivo

    this.inputValue.valueChanges.subscribe(value => {
      if (value) {
        const invalidChar = this.decimalSeparator === ',' ? '.' : ',';
        if (value.toString().includes(invalidChar)) {
          const corrected = value.toString().replace(invalidChar, this.decimalSeparator);
          this.inputValue.setValue(corrected, { emitEvent: false });
        }
      }
    });
  }

  ngOnChanges(): void {
    this.checkValue();
  }

  setDecimalSeparator() {
    const lang = this.translocoService.getActiveLang();
    this.decimalSeparator = lang === 'pt' ? ',' : '.';
  }

  setupMaskAndListener() {
    // Define separador
    const lang = this.translocoService.getActiveLang();
    this.decimalSeparator = lang === 'pt' ? ',' : '.';

    // Remove listener antigo antes de adicionar outro
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }

    // Adiciona listener novo com o separador atualizado
    this.inputSubscription = this.inputValue.valueChanges.subscribe(value => {
      if (value) {
        const invalidChar = this.decimalSeparator === ',' ? '.' : ',';
        if (value.toString().includes(invalidChar)) {
          const corrected = value.toString().replace(invalidChar, this.decimalSeparator);
          this.inputValue.setValue(corrected, { emitEvent: false });
        }
      }
    });
  }

  listenToLangChange() {
    this.translocoService.events$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(event => {
      if (event.type === 'langChanged') {
        this.setupMaskAndListener(); // recria tudo ao trocar idioma
      }
    });
  }

  addSeparatorRestriction() {
    this.inputValue.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      if (value) {
        // sempre verifica o idioma atual
        this.setDecimalSeparator();

        const invalidChar = this.decimalSeparator === ',' ? '.' : ',';

        if (value.toString().includes(invalidChar)) {
          const corrected = value.toString().replace(invalidChar, this.decimalSeparator);
          this.inputValue.setValue(corrected, { emitEvent: false });
        }
      }
    });
  }


  checkValue() {
    this.inputValue.updateValueAndValidity();

    if (this.maskType?.toLowerCase() === 'double') {
      this.inputValue.setValidators([
        Validators.pattern(/^[-+]?[0-9]*[.,]?[0-9]+$/)
      ]);
    } else if (this.maskType?.toLowerCase() === 'integer') {
      this.inputValue.setValidators([
        Validators.pattern(/^[-+]?[0-9]+$/)  
      ]);
    } else {
      this.inputValue.clearValidators();
    }

    this.inputValue.updateValueAndValidity();
  }


  validateInput(): boolean {
    this.inputValue.updateValueAndValidity();

    return this.inputValue.valid;
  }

  onSave() {
    if (this.validateInput()) {
      console.log('Saving value:', this.inputValue.value);
    } else {
      console.log('Invalid input, cannot save');
      if (this.maskType?.toLowerCase() === 'double') {
        this.errorMessage = 'Por favor coloque um número decimal válido.';
      } else if (this.maskType?.toLowerCase() === 'integer') {
        this.errorMessage = 'Por favor coloque um número inteiro válido.';
      } else {
        this.errorMessage = 'Entrada inválida.';
      }
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
