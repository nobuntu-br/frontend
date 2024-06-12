import { Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {

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

  @Input() dataType: string; // Define os tipos de dados aceitos

  @Input() value: string;// Define o valor do input que esta sendo digitado no campo

  @Input() language: string; // Define a linguagem do programa

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
  @Output() valueChange = new EventEmitter<string>(); // EventEmitter para notificar mudanças no valor

  constructor(protected injector: Injector,
    private el: ElementRef) {
    super(injector);
    this.translocoService = injector.get(TranslocoService);
    this.language = this.translocoService.getActiveLang();

    this.translocoService.langChanges$.subscribe((activeLang) => {
        this.language = activeLang;
    });
  }

  ngOnInit(): void {
    this.setLabel();

    // this.inputValue.valueChanges.subscribe((newValue: string) => {
    //   console.log("Novo valor digitado no campo: ", newValue);
    //   // Remove caracteres inválidos
    //   newValue = newValue.replace(/[^0-9.]/g, '');

    //   // Remove pontos duplicados e ponto no início
    //   newValue = newValue.replace(/(\.\.+|^\.)/, '');

    //   // Divide o valor em parte inteira e decimal
    //   const parts = newValue.split('.');

    //   // Garante que haja no máximo uma parte decimal
    //   if (parts.length > 2) {
    //     parts.length = 2; // Limita a quantidade de partes a 2 (parte inteira e parte decimal)
    //   }

    //   // Adiciona separadores de milhar na parte inteira
    //   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    //   console.log("Valor presente no resourceForm: ", parts.join('.'));
    //   // return parts.join('.');
    //   this.inputValue.setValue(parts.join('.'), { emitEvent: false });
    // })

    
    //   if (newValue == null) return;

    //   if (typeof newValue === 'number') {
    //     console.log(newValue);
    //     this.changeFormatToMask(this.display, newValue);



    //   } else {
    //     this.display.setValue(newValue);
    //   }
    // });

    // this.display.valueChanges.subscribe((newValue) => {

    //   if(typeof this.inputValue.value === 'number'){
    //     newValue = newValue.replace(',', '.');
    //     this.inputValue.setValue(parseFloat(newValue), { emitEvent: false });
    //   }

    // });

  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    if (this.dataType === 'number') {
        if(this.language === 'en'){
      const input = event.target as HTMLInputElement;
      let value = input.value;

      // Remove caracteres não numéricos, exceto ponto
      value = value.replace(/[^0-9.]/g, '');

      // Permite apenas um ponto decimal
      let parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      input.value = value;
      this.valueChange.emit(value); // Notifica mudança de valor
    }
 
    if (this.language === 'pt') {
        const input = event.target as HTMLInputElement;
        let value = input.value;
  
        // Remove caracteres não numéricos, exceto vírgula
        value = value.replace(/[^0-9,]/g, '');
  
        // Permite apenas uma vírgula decimal
        let parts = value.split(',');
        if (parts.length > 2) {
          value = parts[0] + ',' + parts.slice(1).join('');
        }
  
        input.value = value;
        this.valueChange.emit(value); // Notifica mudança de valor
      }
    }
  }
  @HostListener('blur', ['$event'])
  @HostListener('change', ['$event'])
  onBlur(event: Event) {
    if (this.dataType === 'number') {
        if(this.language === 'en'){
      const input = event.target as HTMLInputElement;
      let value = input.value;

      // Remove ponto final se existir
      if (value.endsWith('.')) {
        value = value.slice(0, -1);
      }

      input.value = value;
      this.value = value; // Atualiza o valor de ngModel
    }
    
    if (this.language === 'pt') {
        const input = event.target as HTMLInputElement;
        let value = input.value;
  
        // Remove vírgula final se existir
        if (value.endsWith(',') || value.endsWith('.')) {
          value = value.slice(0, -1);
        }

        // Substitui vírgula por ponto
      value = value.replace(',', '.');

        input.value = value;
        this.value = value; // Atualiza o valor de ngModel
        console.log(input.value)
      }
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
        // console.log("erro do transloco:"+error)
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}