import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component,Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-selector-input-field',
  templateUrl: './selector-input-field.component.html',
  styleUrls: ['./selector-input-field.component.scss']
})
export class SelectorInputFieldComponent implements AfterViewInit{
  /**
   * Título que será apresentado no componente
   */
  @Input() label: string;
  /**
   * Url da API para obter dados da classe que será apresentada pelo componente
   */
  @Input() apiUrl: string;
  @Input() valuesList: object[];
  /**
   * Nome da variável que será apresentada no input field ao ser selecionado
   */
  @Input() displayedSelectedVariableOnInputField: string;
  @Input() returnedVariable: string | null;
  /**
   * Quantidade limite de itens que podem ser selecionados
   */
  @Input() selectItemsLimit: number = 1;
  
  public inputValue = new FormControl<object[]>([]);
  
  constructor(
    private httpClient: HttpClient
  ){
  }

  ngAfterViewInit(): void {
    if(this.apiUrl != null){
      this.getItemsFromAPI(this.apiUrl);
    }

    //TODO ao entrar no formulário, não aparece as opções selecionadas
  }

   
  getItemsFromAPI(apiUrl: string){
    this.httpClient.get<object[]>(apiUrl).pipe(take(1)).subscribe({
      next: (returnedData) =>{
        this.valuesList = returnedData;
      },
      error: (error) => {
        console.error("Error to get items on Selector "+error);
      }
    })
  }

}
