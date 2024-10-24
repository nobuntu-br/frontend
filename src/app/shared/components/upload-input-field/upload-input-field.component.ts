import { AfterViewInit, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';

export interface ISelectorValue {
  pt: string;
  en: string;
  id: string;
}

@Component({
  selector: 'app-upload-input-field',
  templateUrl: './upload-input-field.component.html',
  styleUrls: ['./upload-input-field.component.scss']
})

export class UploadInputFieldComponent implements AfterViewInit {
  /**
   * Título que será apresentado no componente
   */
  @Input() label: string;
  @Input() valuesList: ISelectorValue[];
  /**
   * Quantidade limite de itens que podem ser selecionados
   */
  @Input() selectItemsLimit: number;
  /**
   * Lista de extensões de arquivo permitidas
   */
  @Input() allowedExtensions: string[] = []; // Exemplo de extensões permitidas

  public inputValue = new FormControl<object[]>([]);
  fileName: string = '';
  displayedLabel: string = 'Upload de Arquivo';
  placeholder: string = 'Selecione um arquivo';
  charactersLimit: number = 100;
  isRequired: boolean = true;
  svgIcon: string = 'upload'; // Exemplo de ícone

  constructor(private translocoService: TranslocoService) {}

  ngAfterViewInit(): void {
    this.limitSelectedItems(); // Mantém a limitação de itens
  }

  /**
   * Método disparado quando um arquivo é selecionado
   */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const extension = file.name.split('.').pop().toLowerCase(); // Obtém a extensão do arquivo
      if (this.allowedExtensions.includes(extension)) {
        this.fileName = file.name;
      } else {
        alert(`Extensão de arquivo inválida. Permitido: ${this.allowedExtensions.join(', ')}`);
        event.target.value = ''; // Limpa o input se a extensão for inválida
      }
    }
  }

  /**
   * Limita a quantidade de itens selecionados
   */
  private limitSelectedItems(): void {
    this.inputValue.valueChanges.subscribe((values) => {
      if (values.length > this.selectItemsLimit && this.selectItemsLimit > 1) {
        this.inputValue.setValue(values.slice(0, this.selectItemsLimit));
      }
    });
  }
  
  // Define a posição do ícone (função opcional)
  setIconPosition() {
    return 'start'; // Ou 'end', conforme necessário
  }
}
