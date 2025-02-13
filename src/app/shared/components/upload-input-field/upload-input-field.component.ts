import { AfterViewInit, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { IFieldFile } from 'app/shared/models/file.model';
import { FileService } from 'app/shared/services/file.service';

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

  public inputValue = new FormControl<string>(null);
  fileName: string = '';
  displayedLabel: string = 'Upload de Arquivo';
  placeholder: string = 'Selecione um arquivo';
  charactersLimit: number = 100;
  isRequired: boolean = true;
  svgIcon: string = 'upload'; // Exemplo de ícone

  constructor(private translocoService: TranslocoService, private fileService: FileService, private matSnackBar: MatSnackBar) { }

  ngAfterViewInit(): void {
    // this.limitSelectedItems(); // Mantém a limitação de itens
  }

  /**
   * Método disparado quando um arquivo é selecionado
   */
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const extension = file.name.split('.').pop().toLowerCase(); // Obtém a extensão do arquivo
      if (this.allowedExtensions.includes(extension)) {
        this.inputValue.setValue(file.name);
        this.fileName = file.name;
        this.displayedLabel = this.fileName;
        const base64 = await this.fileService.convertFileToBase64(file);
        const fieldFile: IFieldFile = {
          fieldType: 'file',
          files: [{
            name: file.name,
            size: file.size,
            extension: extension,
            dataBlob: file,
            base64: base64
          }]
        };
        console.log(fieldFile);
        this.fileService.uploadFile(fieldFile).subscribe((response) => {
          this.matSnackBar.open('Arquivo enviado com sucesso', 'Fechar', {
            duration: 2000
          });
        }, (error) => {
          this.matSnackBar.open('Erro ao enviar arquivo', 'Fechar', {
            duration: 2000
          });
        });
      } else {
        this.matSnackBar.open(`Extensão de arquivo inválida. Permitido: ${this.allowedExtensions.join(', ')}`, 'Fechar', {
          duration: 2000
        });
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
