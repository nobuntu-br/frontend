import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';

interface IconOption {
  nome: string;
  valor: number;
}

@Component({
  selector: 'app-avaliacao-unica-field',
  templateUrl: './avaliacao-unica-field.component.html',
  styleUrls: ['./avaliacao-unica-field.component.scss']
})
export class AvaliacaoUnicaFieldComponent extends BaseFieldComponent implements OnInit {
  @Input() label: string;
  @Input() isRequired: boolean = false;
  @Input() className: string;
  @Input() icones: IconOption[] = []; 

  inputValue = new FormControl<number | null>(null, this.isRequired ? Validators.required : null);
  selectedIcon: IconOption | null = null; 
  showSelector: boolean = true; 

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.icones);
    if (this.inputValue.value !== null) {
      this.selectedIcon = this.icones.find(icon => icon.valor === this.inputValue.value) || null;
      this.showSelector = false; 
    }
  }

  selectIcon(icon: IconOption): void {
    this.selectedIcon = icon;
    this.inputValue.setValue(icon.valor);
    console.log(this.inputValue.value);
    this.showSelector = false; 
  }

  showIconSelector(): void {
    this.showSelector = true; 
  }
}