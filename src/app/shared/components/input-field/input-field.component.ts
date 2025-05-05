import { Component, Injector, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * Nome da classe que pertence esse campo.
   */
  @Input() className: string;
  /**
   * Campo de título desse campo.
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
   * Máscara que irá alterar o valor do campo.\
   * Exemplo: "0*.0*" no caso é uma sequência de números, um ponto e seguido de uma sequência de números
   */
  @Input() mask: string;
  /**
  * Tipo de mascara pra fazer a validacao do campo.\
  */
  @Input() maskType: string;
  /**
    * Verifica se é necessario salvar com a formatação da mascara.\
    */
  @Input() needMaskValue: boolean;
  /**
    * Verifica a quantidade de caracteres limites.\
    */
  @Input() limiteOfChars: number;
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
   * Posição do icone no campo.\
   * Exemplo: "end" ou "start".
   */
  @Input() iconPosition: string = "end";
  /**
   * Função para ser realizada ao ser pressionado o icone presente no campo.
   */
  @Input() actionOnClickInIcon: () => void = null;
  /**
   * Valor padrão do campo.
   */
  @Input() defaultValue: string | number | null = null;
  /**
    * Condicao de visibilidade do campo.
    */
  @Input() conditionalVisibility: { field: string, values: string[] }
  /**
  * FormGroup do formulario.
  */
  @Input() resourceForm: FormGroup<any>;

  display = new FormControl<string | null>(null);

  /**
   * Label que será apresentada no titulo desse campo
   */
  displayedLabel: string;

  public inputValue = new FormControl<string | number | null>(null);

  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDefaultValue();
    this.setLabel();
    this.checkConditional();
    this.checkEmailValidation();
    this.setEmailIcon();
    this.applyMaskToValue();
    this.checkCharacterLimit(); 
  }

  ngOnChanges(): void {
    this.checkEmailValidation();
    this.checkCharacterLimit();
    this.applyMaskToValue();
  }

  checkCharacterLimit() {
    if (this.limiteOfChars) {
      this.inputValue.setValidators([
        ...this.inputValue.validator ? [this.inputValue.validator] : [],
        (control: FormControl) => {
          const value = control.value || '';
          return value.length <= this.limiteOfChars
            ? null
            : { characterLimitExceeded: true };
        }
      ]);
      this.inputValue.updateValueAndValidity();
    }
  }

  checkEmailValidation() {
    if (this.maskType?.toLowerCase() === 'email') {
      this.inputValue.setValidators([Validators.email]);
    } else {
      this.inputValue.clearValidators();
    }
    this.inputValue.updateValueAndValidity();
  }

  setEmailIcon() {
    if (this.maskType?.toLowerCase() === 'email') {
      this.svgIcon = 'email'; // Defina o ícone de email do Material Icons aqui
      this.actionOnClickInIcon = () => {
        const email = this.inputValue.value;
        if (email) {
          window.location.href = `mailto:${email}`;
        }
      };
    }
  }
  applyMaskToValue() {
    if (this.mask) {
      this.inputValue.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newValue => {
        if (newValue !== null && newValue !== undefined) {
          let formattedValue: string | number = newValue.toString();
          if (this.needMaskValue) {
            // Implementação da lógica de formatação da máscara aqui
            formattedValue = this.formatValueWithMask(formattedValue.toString(), this.mask);

            this.inputValue.setValue(formattedValue, { emitEvent: false });
          }

        }
      });
    }
  }

  formatValueWithMask(value: string, mask: string): string {
    let formattedValue = '';
    let valueIndex = 0;
    let maskIndex = 0;

    while (maskIndex < mask.length && valueIndex < value.length) {
      if (mask[maskIndex] === '0') {
        if (/\d/.test(value[valueIndex])) {
          formattedValue += value[valueIndex];
          valueIndex++;
        }
      } else if (mask[maskIndex] === '*') {
        formattedValue += value[valueIndex];
        valueIndex++;
      } else if (mask[maskIndex] === '.') {
        formattedValue += '.';
      } else if (mask[maskIndex] === '-') {
        formattedValue += '-';
      } else if (mask[maskIndex] === '(') {
        formattedValue += '(';
      } else if (mask[maskIndex] === ')') {
        formattedValue += ')';
      } else if (mask[maskIndex] === '/') {
        formattedValue += '/';
      } else if (mask[maskIndex] === ',') {
        formattedValue += ',';
      }

      maskIndex++;
    }

    return formattedValue;
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
      error: (error) => {
        this.displayedLabel = this.setCharactersLimit(this.label, this.charactersLimit);
      },
    });
  }

  setIconPosition(): string {
    if (this.svgIcon == null) return;

    if (this.iconPosition == null) {
      return "end";
    }
    if (this.iconPosition == "end" || this.iconPosition == "start") {
      return this.iconPosition;
    }
  }

  changeFormatToMask(inputValueForm: FormControl, newValue: string | number) {
    if (newValue.toString().includes(',') && this.mask.includes('.')) {
      const formattedValue = newValue.toString().replace(',', '.');
      inputValueForm.setValue(formattedValue, { emitEvent: false });
    } else if (newValue.toString().includes('.') && this.mask.includes(',')) {
      const formattedValue = newValue.toString().replace('.', ',');
      inputValueForm.setValue(formattedValue, { emitEvent: false });
    }
  }

  getDefaultValue() {
    if (this.defaultValue != null) {
      this.inputValue.setValue(this.defaultValue);
    }
  }

  validateInput(): boolean { //verificar para salvar
    this.inputValue.updateValueAndValidity();
    return this.inputValue.valid;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
