import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input } from '@angular/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-subform',
  templateUrl: './subform.component.html',
  styleUrls: ['./subform.component.scss']
})
export class SubformComponent implements AfterViewInit{
  /**
   * Nomes dos campos que serão apresentados.
   * @example ['nome', 'idade'].
   */
  @Input() displayedfieldsName: string[] | null;
  /**
   * Tipos das variáveis da classe.
   * @example ['string', 'number'].
   */
  @Input() fieldsType: string[];
  /**
   * Link completo no qual é capaz de obter as instâncias dessa classe no banco de dados.\
   * @example "https://siteDoProgramador.com/api/carros"
   */
  @Input() apiUrl!: string;
  /**
   * Nome da classe na qual o formulário pertence
   */
  @Input() className!: string;
  /**
   * Dados que orienta na criação das paginas.
   */
  @Input() dataToCreatePage: object;

  constructor(private httpClient: HttpClient){
    
    
  }

  ngAfterViewInit(): void {
    

  }
}
