import { AfterViewInit, Component, Injector, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFieldFile } from 'app/shared/models/file.model';
import { FileService } from 'app/shared/services/file.service';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-upload-input-field',
  templateUrl: './upload-input-field.component.html',
  styleUrls: ['./upload-input-field.component.scss']
})

export class UploadInputFieldComponent extends BaseFieldComponent implements AfterViewInit {
  /**
   * Título que será apresentado no componente
   */
  @Input() label: string;
  /**
   * Quantidade limite de itens que podem ser selecionados
   */
  @Input() selectItemsLimit: number;
  /**
   * Lista de extensões de arquivo permitidas
   */
  @Input() allowedExtensions: string[] = []; // Exemplo de extensões permitidas
  /**
   * Nome da classe que pertence esse campo.
   */
  @Input() className: string;
    /**
     * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
     */
    private ngUnsubscribe = new Subject();
  /**
   * Maximo de tamanho do arquivo
    */
  @Input() maxFileSize: number; // Exemplo de tamanho máximo de arquivo

  public inputValue = new FormControl<string>(null);
  fileName: string = '';
  displayedLabel: string = 'Upload de Arquivo';
  placeholder: string = 'Selecione um arquivo';
  charactersLimit: number = 100;
  isRequired: boolean = true;
  svgIcon: string = 'upload'; // Exemplo de ícone

  constructor(private fileService: FileService, private matSnackBar: MatSnackBar, protected injector: Injector) {
    super(injector);
   }

  ngAfterViewInit(): void {
    this.setLabel();
    // this.limitSelectedItems(); // Mantém a limitação de itens
  }

  /**
   * Método disparado quando um arquivo é selecionado
   */
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (!this.checkMaxFileSize(file)) {
        event.target.value = ''; // Limpa o input se o arquivo for muito grande
        return;
      }
      const extension = file.name.split('.').pop().toLowerCase(); // Obtém a extensão do arquivo
      if (this.allowedExtensions.includes(extension)) {
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
        this.fileService.uploadFile(fieldFile).subscribe((response) => {
          this.inputValue.setValue(response);
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

  setLabel() {
    this.setTranslation(this.className, this.label).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (translatedLabel: string) => {
        if(translatedLabel === (this.className+"."+this.label)){
          const formattedLabel = this.formatDefaultVariableName(this.label);
          this.displayedLabel = this.setCharactersLimit(formattedLabel, this.charactersLimit);
        } else {
          this.displayedLabel = this.setCharactersLimit(translatedLabel, this.charactersLimit);
        }
      },
      error: (error) => {
        this.displayedLabel = this.setCharactersLimit(this.label, this.charactersLimit);
      },
    });
  }

  checkMaxFileSize(file: File): boolean {
    if (!this.maxFileSize) return true;
    if (file.size > this.maxFileSize) {
      this.matSnackBar.open(`Tamanho máximo permitido: ${this.maxFileSize / 1000000}MB`, 'Fechar', {
        duration: 2000
      });
      return false;
    }
    return true;
  }
  
  // Define a posição do ícone (função opcional)
  setIconPosition() {
    return 'start'; // Ou 'end', conforme necessário
  }
}
