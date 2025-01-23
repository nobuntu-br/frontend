import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
  selector: 'app-avaliacao-field',
  templateUrl: './avaliacao-field.component.html',
  styleUrls: ['./avaliacao-field.component.scss']
})
export class AvaliacaoFieldComponent extends BaseFieldComponent implements OnInit {
  @Input() label: string;
  @Input() charactersLimit: number;
  @Input() isRequired: boolean = false;
  @Input() className: string;

  inputValue = new FormControl<number | null>(null, this.isRequired ? Validators.required : null);
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    // Inicialização do componente
  }

  rate(value: number): void {
    console.log(`Valor selecionado: ${value}`);
    this.inputValue.setValue(value);
  }
}