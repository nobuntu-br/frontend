import { Component, Injector, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { OrderService } from 'app/modules/orders/shared/order.service';
import { BaseResourceFormComponent } from '../form/form.component';
import { Order } from 'app/modules/orders/shared/order.model';
import { MatDialog } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { InputDateFieldComponent } from '../input-date-field/input-date-field.component';
import { InputFieldComponent } from '../input-field/input-field.component';
import { SelectorInputFieldComponent } from '../selector-input-field/selector-input-field.component';
import { ForeignKeyInputFieldComponent } from '../foreign-key-input-field/foreign-key-input-field.component';
import { CalculatorComponent } from 'app/shared/component/calculator/calculator.component';
import { DefaultListComponent } from '../default-list/default-list.component';
import { ComponentType } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dinamic-list',
  templateUrl: './dinamic-list.component.html',
  styleUrls: ['./dinamic-list.component.scss']
})
export class DinamicListComponent extends BaseResourceFormComponent<Order> implements OnInit{
  @Input() itemsDisplayed: any[];
  @Input() fieldsDisplayed: string[];
  @Input() fieldsType: string[];
  @Input() userConfig: any;

  @ViewChild('placeToRender', {read: ViewContainerRef}) target!: ViewContainerRef;

  constructor(
    protected orderService: OrderService, 
    protected injector: Injector, 
    private dialog: MatDialog
    ){
    super(injector, new Order(), orderService, Order.fromJson);
  } 

  ngOnInit(): void {
    super.ngOnInit();//Executa o ngOnInit de extends
    this.createComponentsOnView();
  }

  protected buildResourceForm(){
    this.resourceForm = this.formBuilder.group({
      id: [null],
      notes: [null, [Validators.required, Validators.minLength(2)]]
    });
  }

  createComponentsOnView(){
    setTimeout(() => {
      // this.fieldsDisplayed.forEach((fieldDisplayed, index)=>{
      //   // this.createComponent(this.fieldsType[index], this.itemDisplayed[fieldDisplayed], fieldDisplayed);
      // });
      // this.createComponent('date', 'campoData', null, "Data aqui");
      // this.createComponent('text', 'campoTexto', null, "Texto aqui");
      // this.createComponent('number', 'campoNumero', null, "Numero aqui");
      // this.createComponent('object', 'campoObject', null, "Object aqui");
      this.createComponent('foreignKey', 'campoChaveEstrangeira', null, "Chave aqui");
      this.createComponent('list', 'list', null, "Chave aqui");
    }, 200); 
  }

  //TODO remover código repetitivo
  createComponent(fieldType, fieldName, value, labelTittle){
    let createdComponent;
    switch(fieldType){
      case 'date':{
        createdComponent = this.target.createComponent(InputDateFieldComponent);
        createdComponent.instance.label = labelTittle;

        break;
      }
      case 'text':{
        createdComponent = this.target.createComponent(InputFieldComponent);
        // createdComponent.instance.label = labelTittle;
        createdComponent.instance.label = "titulo 2";
        createdComponent.instance.svgIcon = "heroicons_solid:user";
        createdComponent.instance.isRequired = true;
        // createdComponent.instance.actionOnClickInIcon = ()=>{console.log("Você apertou no icone")}

        break;
      }
      case 'object':{
        createdComponent = this.target.createComponent(SelectorInputFieldComponent);
        createdComponent.instance.label = "titulo";
        createdComponent.instance.valuesList = [{nome:"cleitin", idade:22},{nome:"marcos", idade:21}];
        createdComponent.instance.displayedVariable = "idade";
        
        break;
      }
      case 'foreignKey':{
        createdComponent = this.target.createComponent(ForeignKeyInputFieldComponent);
        createdComponent.instance.label = labelTittle;
        createdComponent.instance.apiUrl = "http://localhost:8080/api/employees";
        createdComponent.instance.fieldsDisplayed =  ['firstName', "lastName", "company", 'city', "businessPhone", "createdAt"];
        createdComponent.instance.fieldsType = ['string', 'string', 'string', 'string', 'string', 'date'];
        createdComponent.instance.columnsQuantity = 3;
        createdComponent.instance.fieldDisplayedInLabel = "firstName";

        createdComponent.instance.searchableFields = ["firstName", "company"];
        break;
      }
      case 'number':{
        createdComponent = this.target.createComponent(InputFieldComponent);
        // createdComponent.instance.label = labelTittle;
        createdComponent.instance.label = "titulo numero";
        createdComponent.instance.svgIcon = "heroicons_solid:calculator";
        createdComponent.instance.isRequired = true;
        createdComponent.instance.iconPosition = "start";
        createdComponent.instance.mask="0*,0*";
        createdComponent.instance.actionOnClickInIcon = ()=>{this.openDialog(this.dialog, CalculatorComponent)}
        
        break;
      }
      case 'list':{
        createdComponent = this.target.createComponent(DefaultListComponent);
        // createdComponent.instance.label = labelTittle;
        createdComponent.instance.columnsQuantity = 3;
        createdComponent.instance.fieldsDisplayed = ['firstName', "lastName", "company", 'city', "businessPhone", "createdAt"];
        createdComponent.instance.fieldsType = ['string', 'string', 'string', 'string', 'string', 'date'];
        createdComponent.instance.apiUrl = "http://localhost:8080/api/employees";
        createdComponent.instance.selectedItemsLimit= 4;
        createdComponent.instance.searchableFields = ["firstName", "company"];
        
        break;
      }
      //TODO fazer o componente da imagem

      //TDO 
      default :{
      
        break;
      }
    }
    // Cria e adiciona um novo FormControl no formulário do componente atual
    let newFormControl = this.formBuilder.control<any>(null);
    this.resourceForm.addControl(fieldName, newFormControl);

    //Escutara o retorno do componente filho e colocará os dados no controlador do formulário
    if(createdComponent.instance.newValueEvent == null){
      return;
    }
    createdComponent.instance.newValueEvent.subscribe(
      (data) => {
        console.log(data.value);
        newFormControl.setValue(data.value);
      },
      (error) => {
        console.warn("Erro ao obter dados do componente no formulário");
      }
    )
  }

  //TODO verificar se essa responsabilidade de abrir dialog deve ficar aqui ou dentro do componente responsável
  openDialog(dialog : MatDialog, component: ComponentType<any>) {
    const dialogRef = dialog.open(component,
      {
        data:{display:"0"}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result == null) return;
      });
  }

  printForm(){
    console.log(this.resourceForm.value);
  }
}
