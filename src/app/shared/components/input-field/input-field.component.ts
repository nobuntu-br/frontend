import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { Subject, takeUntil } from 'rxjs';

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
  @Input() charactersLimit : number;
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

  constructor(protected injector: Injector){
    super(injector);
  }

  ngOnInit(): void {
    this.setLabel();
    // this.inputValue.valueChanges.subscribe((newValue: string | number) => {
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

  setLabel() {
    this.setTranslation(this.className, this.label).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (translatedLabel: string) => {
        if(translatedLabel === (this.className+"."+this.label)){
          const formattedLabel = this.formatDefaultVariableName(this.label);
          this.displayedLabel = this.setCharactersLimit(formattedLabel, this.charactersLimit);
        } else {
          this.displayedLabel = this.setCharactersLimit(translatedLabel, this.charactersLimit);
        }
      },
      error: (error) => {
        console.log("erro do transloco:"+error)
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
