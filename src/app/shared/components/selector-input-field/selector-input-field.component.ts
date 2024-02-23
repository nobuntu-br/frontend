import { Component,Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-selector-input-field',
  templateUrl: './selector-input-field.component.html',
  styleUrls: ['./selector-input-field.component.scss']
})
export class SelectorInputFieldComponent{
  @Input() label: string;
  @Input() valuesList: any[];
  @Input() displayedSelectedVariableOnInputField: string;
  @Input() returnedVariable: string | null;
  
  public inputValue = new FormControl<any | null>(null);

}
