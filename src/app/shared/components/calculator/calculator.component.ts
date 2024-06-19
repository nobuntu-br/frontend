import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})

export class CalculatorComponent {
  display = '';
  lastOperator = '';
  lastOperand = '';
  newCalculation = false;
  history: string[] = [];
  isVisible = true;
  decimalOperator: string;
  isHistoryVisible = false; // Controla a visibilidade do histórico no modo celular
  isMobile = window.innerWidth <= 768; // Detecta se a tela é de um dispositivo móvel

  ngOnInit(): void {
        this.subscribeChangeLanguageEvent(this.translocoService);
        if(this.dialogInjectorData.formData===undefined || this.dialogInjectorData.formData ===null){
          this.display="";
        }else{
        this.display=this.dialogInjectorData.formData;
      }
      }
      

      private ngUnsubscribe = new Subject();

      subscribeChangeLanguageEvent(translocoService: TranslocoService){
              translocoService.events$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((eventResponse)=>{
                if(eventResponse.type == "langChanged"){
                  
                }
              });
            }


  constructor(private translocoService: TranslocoService,
        public dialogCalculatorRef: MatDialogRef<CalculatorComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public dialogInjectorData,
    ) {

      this.decimalOperator = this.translocoService.translate('componentsBase.filter-number-range-component.decimalOperator');
      window.addEventListener('resize', this.checkIfMobile.bind(this));
    }
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
      console.log(`window.innerWidth (check): ${window.innerWidth}`);
      console.log(`isMobile (check): ${this.isMobile}`);
    }
  
  appendCharacter(char: string) {
    if (char === '.') {
    const parts = this.display.split(/[+\-*/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) {
        return;
    }
}
    if (this.newCalculation && !'+-*/'.includes(char)) {
      this.display = char;
      this.newCalculation = false;
    } else {
      if (this.isOperator(char) && this.isOperator(this.display.slice(-1))) {
        this.display = this.display.slice(0, -1) + char;
      } else {
        this.display += char;
      }
      this.newCalculation = false;
    }
  }

  clear() {
    this.display = '';
    this.lastOperator = '';
    this.lastOperand = '';
    this.newCalculation = false;
  }

  backspace() {
    this.display = this.display.slice(0, -1);
  }

  calculate() {
    try {
      if (this.newCalculation && this.lastOperator && this.lastOperand) {
        const result = eval(`${this.display}${this.lastOperator}${this.lastOperand}`);
        this.display = result.toString();
        this.history.push(`${this.display}${this.lastOperator}${this.lastOperand} = ${result}`);
      } else {
        const result = parseFloat(eval(this.display).toFixed(2));

        this.history.push(`${this.display} = ${result}`);
        this.lastOperator = this.display.match(/[+\-*/]/g)?.pop() || '';
        this.lastOperand = this.display.split(/[+\-*/]/g).pop() || '';
        this.display = result.toString();
        this.newCalculation = true;
      }
    } catch {
      this.display = 'Erro';
    }
  }

  isOperator(char: string) {
    return '+-*/'.includes(char);
  }
  calculatePercentage() {
    try {
      // Extrair o resultado da expressão atual sem o operador final e número
      let expression = this.display;
      let lastOperatorIndex = Math.max(
        expression.lastIndexOf('+'),
        expression.lastIndexOf('-'),
        expression.lastIndexOf('*'),
        expression.lastIndexOf('/')
      );
      
      if (lastOperatorIndex !== -1) {
        let lastOperator = expression.charAt(lastOperatorIndex);
        let beforeOperator = expression.slice(0, lastOperatorIndex);
        let afterOperator = parseFloat(expression.slice(lastOperatorIndex + 1));
        
        if (!isNaN(afterOperator)) {
          let resultBeforeOperator = parseFloat(eval(beforeOperator).toFixed(2));
          let percentage = resultBeforeOperator * (afterOperator / 100);
          
          this.display = beforeOperator + lastOperator + percentage.toString();
        }
      }
    } catch {
      this.display = 'Erro';
    }
  }

  cancel() {
    if (this.dialogInjectorData.formData === undefined || this.dialogInjectorData.formData === null) {
      this.dialogCalculatorRef.close();
    }else{
    this.dialogCalculatorRef.close(parseFloat(this.dialogInjectorData.formData));
  }
  }

  confirm() {

    if(this.display== ''){
      this.dialogCalculatorRef.close('');
    }else{
      const result = eval(this.display);
      this.dialogCalculatorRef.close(parseFloat(result));
    }
    
  }
  toggleHistoryVisibility() {
    this.isHistoryVisible = !this.isHistoryVisible;
  }
  insertNumberIntoForm(number: string) {
    // Função de exemplo, substitua pela sua implementação real
    console.log(`Número inserido no formulário: ${number}`);
  }
     ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
}
}