import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { DateFieldComponent } from '../date-field/date-field.component';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-default-card',
  templateUrl: './default-card.component.html',
  styleUrls: ['./default-card.component.scss']
})
export class DefaultCardComponent implements AfterViewInit{

  @Input() itemDisplayed: any;
  /**
   * Nome da classe na qual o formulário pertence
   */
  @Input() className : string;
  @Input() columnsQuantity: number;
  @Input() displayedfieldsName: string[];
  @Input() fieldsType: string[];
  @Input() userConfig: any;
  @Input() isSelectable: boolean = true;
  @Output() eventClick = new EventEmitter<void>();
  @Output() eventOnSelect = new EventEmitter<void>();
  
  columnsQuantityStyle;
  isSelected: boolean = false;
  

  @ViewChild('placeToRender', {read: ViewContainerRef}) target!: ViewContainerRef;

  constructor(){}

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
    if(target == null) console.error("Target not renderized in DefaultCard");
    
    let componentCreated;
    
    switch(fieldType){

      case 'date':{
        componentCreated = this.target.createComponent(DateFieldComponent).instance;
        componentCreated.format = this.getFormatDateFromUserConfig();
        break;
      }
      default :{
        componentCreated = this.target.createComponent(FieldComponent).instance;
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
  }
  
}

