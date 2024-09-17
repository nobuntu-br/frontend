import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BaseFieldComponent } from '../components/base-field/base-field.component';

@Component({
  selector: 'app-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.scss']
})
export class CheckboxFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {
  /**
   * Label que será apresentada no titulo desse campo
   */
  displayedLabel: string;
  /**
     * Nome da classe que pertence esse campo.
     */
  @Input() className: string;
  /**
   * Campo de título desse campo.
   */
  @Input() label: string;
  /**
   * É preciso preencher o campo.\
   * Exemplo: true.
   */
  @Input() isRequired: boolean = false;
  /**
   * Quantidade máxima de letras.\
   */
  @Input() charactersLimit : number;
    /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
    private ngUnsubscribe = new Subject();
  /**
   * Campo que retorna o valor do checkbox.
   * @example true
  */ 
  public inputValue = new FormControl<boolean | null>(null);


  constructor(injector: Injector) {
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
        console.log("erro do transloco:"+error)
        this.displayedLabel = this.setCharactersLimit(this.label, this.charactersLimit);
      },
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  onChange(event: any) {
    this.inputValue = event.target.inputValue;
  }


}
