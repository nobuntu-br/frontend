import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

const decimalCommaLanguages = ['pt'];
const decimalPointLanguages = ['en'];

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit, OnDestroy {
  history: string[] = [];
  operationsDisplay: string = '';

  fullOperationDisplay: string = ''; //Cara de cima (mostra a operação inteira. exemplo: 2+4/3*5)
  display: string = ''; // Variável que a gente pega os numeros\\
  calculatorBase: string = '';

  operators = ['+', '-', '*', '/', '='];
  isResult: boolean = false;
  dotIsUsed: boolean = false;
  decimalSeparator: string = 'point';//point / comma
  

  value1: number = null;
  value2: number = null;
  operator: string = null;

  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  private ngUnsubscribe = new Subject();
  
  constructor(
    private translocoService: TranslocoService,
    // public dialogCalculatorRef: MatDialogRef<CalculatorComponent>,
    ){}

  ngOnInit(): void {
    this.subscribeChangeLanguageEvent(this.translocoService);
  }
  
  closeCalculator(): void {
    // this.dialogCalculatorRef.close(parseFloat(this.display));
  }

  subscribeChangeLanguageEvent(translocoService: TranslocoService){
    translocoService.events$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((eventResponse)=>{
      if(eventResponse.type == "langChanged"){
        this.changeCalculatorLanguage(eventResponse.payload.langName);
      }
    });
  }

  getDisplay(){
    return this.translateDisplay();
  }

  translateDisplay(){
    let value = this.display;
    if(this.decimalSeparator == 'comma'){
      value.replace('.',',');
    } else {
      value.replace(',','.');
    }
    return value;
  }

  changeCalculatorLanguage(activeLanguage: string){
    if(decimalCommaLanguages.includes(activeLanguage)){
      this.decimalSeparator = 'comma';
    } else {
      this.decimalSeparator = 'point';
    }
  }

  multiplyValue(value1, value2): number{
    return value1 * value2;
  }

  addValue(value1, value2): number{
    return value1 + value2;
  }

  subtractValue(value1, value2): number {
    return value1 - value2;
  }

  divideValue(value1, value2): number{
    if(value2 == 0 || value1==0){
      return 0;
    }
    return value1 / value2;
  }

  appendToDisplay(value : string){
    console.log("Valor de entrada: ");
    console.log(value);
    

    //Se for escrito um operador
    if(this.operators.includes(value) == true){
      console.log("inserido um operador")
      //Verifica se o ultimo valor é um operador
      if(this.operators.includes(this.calculatorBase[this.calculatorBase.length - 1]) == true){
        console.log("ultimo valor é um operador")
        if(this.operator != null){
          console.log("Operador diferente de nulo")
          this.fullOperationDisplay = this.removeLastChar(this.calculatorBase); 
          this.calculatorBase = this.removeLastChar(this.calculatorBase);
          this.operator = value;  
          console.log("Operador substituido")

          this.calculatorBase += value;
          this.fullOperationDisplay += value;
        } else {
          console.log("Operador igual a nulo")
          this.operator = value;

          this.calculatorBase += value;
          this.fullOperationDisplay += value;
        }
        
      } else {
        console.log("ultimo valor não é um operador")
        if(this.value1 == null && this.value2 == null){
          this.value1 = parseFloat(this.calculatorBase);
          console.log("this.value1 == null && this.value2 == null")
          console.log("value1 foi setado!");
          this.operator = value;
          // this.display = '';
        } else if(this.value1 != null && this.value2 == null){
   
          console.log("this.value2 == null sengundo if",this.value2)
   
          
          this.operationsDisplay = this.value1.toString();
          this.operator = value;
          this.operationsDisplay += value;
          // this.display = '';
        } else if(this.value1 != null && this.value2 != null){
          this.value1 = parseFloat(this.calculatorBase);
          // this.value2 = null;
          console.log("this.value1 != null && this.value2 != null")
          this.equal();
          this.operator = value;
          this.operationsDisplay += value;
        }
        // this.display = '';
        this.calculatorBase +=value;
        this.fullOperationDisplay += value;
      }
    
    } else {

      
      console.log("inserido um numero")
      //Verifica se o ultimo valor é um operador
      if(this.operators.includes(this.calculatorBase[this.calculatorBase.length - 1]) == true){
        console.log("else de baixo")
        this.value2 = parseFloat(this.calculatorBase);
        this.value1 = this.equal();
        this.calculatorBase = '';
        //Adiciona o numero
        this.calculatorBase += value;
        // this.fullOperationDisplay += value;

        this.display = '';
        this.display += value;
      } else {
        console.log("else de baixo2")
        //Adiciona o numero
        this.calculatorBase += value;
        // this.fullOperationDisplay += value;
        this.display += value;
      }
      
      
    }
    console.log("valor do calculatorBase: "+this.calculatorBase)
  }

  removeAll(){
    this.value1 = 0;
    this.value2 = 0;
    this.calculatorBase = "";
    this.display = "";
    this.fullOperationDisplay = "";
  }

  removeLastNumber(){
    this.display = this.display.slice(0,-1);
    this.calculatorBase = this.calculatorBase.slice(0,-1);
  }

  removeLastChar(value){
    return value.slice(0,-1);
  }

  equal(){
    console.log(this.value1, this.value2, this.operator);
    if(this.value1 != null && this.value2 != null && this.operator != null){
      let newValue = this.calculate(this.value1, this.value2, this.operator); 
      return newValue;
    }
    
  }

  calculate(value1: number, value2: number, operator: string): number{
    console.log(value1, value2, operator,"debug")
    let newValue = 0;
    switch(operator){
      case '-':
        newValue = this.subtractValue(value1, value2);
        break;
      case '+':
        newValue = this.addValue(value1, value2);
        break;
      case '*':
        newValue = this.multiplyValue(value1, value2);
        break;
      case '/':
        newValue = this.divideValue(value1, value2);
        break;
    }
    console.log(newValue)
    return newValue;
    
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
}
}
