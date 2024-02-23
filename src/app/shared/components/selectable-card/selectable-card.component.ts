import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { DateFieldComponent } from '../date-field/date-field.component';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'selectable-card',
  templateUrl: './selectable-card.component.html',
  styleUrls: ['./selectable-card.component.scss'],
})
export class SelectableCardComponent implements AfterViewInit{

  @Input() itemDisplayed: any;
  /**
   * Nome da classe na qual o formulário pertence
   */
  @Input() className : string;
  @Input() columnsQuantity: number = 1;
  @Input() displayedfieldsName: string[];
  @Input() fieldsType: string[];
  @Input() userConfig: any;
  @Input() isCheckBox: boolean = true;
  @Input() isSelectable: boolean = true;
  @Input() isEditable: boolean = false;
  @Output() eventClick = new EventEmitter<void>();
  @Output() eventOnSelect = new EventEmitter<void>();
  @Output() eventClickToEdit = new EventEmitter<void>();

  columnsQuantityStyle;
  @Input() isSelected: boolean = false;
  

  @ViewChild('placeToRender', {read: ViewContainerRef}) target!: ViewContainerRef;

  constructor(){
  }

  ngAfterViewInit(): void {
    this.createComponentsOnView();
  }

  get customStyle(): any {
    return {
      'grid-template-columns': `repeat(${this.columnsQuantity}, 1fr)`,
    };
  }

  createComponentsOnView(){
    setTimeout(() => {
      this.displayedfieldsName.forEach((fieldDisplayedName, index)=>{
        this.createComponent(this.target, this.fieldsType[index], this.itemDisplayed[fieldDisplayedName], fieldDisplayedName);
      });
    }, 0); 
  }

  createComponent(target: ViewContainerRef , fieldType, value, labelTittle: string){
    if(target == null) console.error("Target not renderized in SelectableCard");
    let componentCreated;

    switch(fieldType){
      case 'date':{
        componentCreated = target.createComponent(DateFieldComponent).instance;
        componentCreated.format = this.getFormatDateFromUserConfig();
        break;
      }
      default :{
        componentCreated = target.createComponent(FieldComponent).instance;
        break;
      }
    }
    componentCreated.label = labelTittle;
    componentCreated.value = value;
    componentCreated.className = this.className;
  }

  getFormatDateFromUserConfig(){
    if(this.userConfig == null){
      return "dd/MM/YY"
    }

    if(this.userConfig.dateFormat != null){
      return this.userConfig.dateFormat;
    } else {
      return "dd/MM/YY"
    }
  }

  getLanguageDateFromUserConfig(){
    if(this.userConfig == null){
      return "en"
    }

    if(this.userConfig.dateFormat != null){
      return this.userConfig.language;
    } else {
      return "en"
    }
  }

  onClick() {
    this.eventClick.emit(this.itemDisplayed);
  }

  selectItem(event: any | null) {
    this.eventOnSelect.emit(this.itemDisplayed);
    if(event != null){
      event.source.checked = false;
    }
  }

  onClickToEdit(){
    this.eventClickToEdit.emit(this.itemDisplayed);
  }
}
