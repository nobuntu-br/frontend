import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
  selector: 'app-input-date-field',
  templateUrl: './input-date-field.component.html',
  styleUrls: ['./input-date-field.component.scss']
})
export class InputDateFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy{
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
   * É preciso preencher o campo.\
   * Exemplo: true.
  */
  @Input() isRequired: boolean = false;
  /**
  * Nome da classe que pertence esse campo.
  */
  @Input() className: string;
  /**
   * Label que será apresentada no titulo desse campo
   */
  displayedLabel: string;

  inputValue = new FormControl<Date | null>(null);
  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();

  constructor(protected injector: Injector){
    super(injector);
  }

  ngOnInit(): void {
    this.setLabel();
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
        this.displayedLabel = this.setCharactersLimit(this.label, this.charactersLimit);
      },
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
