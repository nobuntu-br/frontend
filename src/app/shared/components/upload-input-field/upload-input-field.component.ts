import { AfterViewInit, Component, Injector, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFieldFile } from 'app/shared/models/file.model';
import { FileService } from 'app/shared/services/file.service';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { Subject, takeUntil } from 'rxjs';
import { BaseUpoadFieldComponent } from '../base-field/base-upload-field.component';


@Component({
  selector: 'app-upload-input-field',
  templateUrl: './upload-input-field.component.html',
  styleUrls: ['./upload-input-field.component.scss']
})

export class UploadInputFieldComponent extends BaseUpoadFieldComponent implements OnInit, AfterViewInit {
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
  /**
      * Condicao de visibilidade do campo.
      */
  @Input() conditionalVisibility: { field: string, values: string[] }
  /**
  * FormGroup do formulario.
  */
  @Input() resourceForm: FormGroup<any>;

  public inputValue = new FormControl<string>(null);
  fileName: string = '';
  displayedLabel: string = 'Upload de Arquivo';
  placeholder: string = 'Selecione um arquivo';
  charactersLimit: number = 100;
  isRequired: boolean = true;
  svgIcon: string = 'upload'; // Exemplo de ícone

  constructor(protected injector: Injector, protected fileService: FileService, protected matSnackBar: MatSnackBar) {
    super(injector, fileService, matSnackBar);
  }

  ngAfterViewInit(): void {
    this.setLabel();
    // this.limitSelectedItems(); // Mantém a limitação de itens
  }

  ngOnInit(): void {
    this.checkConditional();
  }

  
  checkConditional() {
    if (this.conditionalVisibility) {
      let initialFieldValue = this.resourceForm.get(this.conditionalVisibility.field)?.value;
      console.log('Initial field value:', initialFieldValue);
      if (initialFieldValue && typeof initialFieldValue === 'object' && initialFieldValue.id) {
        initialFieldValue = initialFieldValue.id;
      }
      if (initialFieldValue !== null && typeof initialFieldValue !== 'string') {
        initialFieldValue = initialFieldValue.toString();
      }
      if (this.conditionalVisibility.values.includes(initialFieldValue)) {
        if (this.inputValue.disabled) {
          this.inputValue.enable();
        }
      } else {
        if (this.inputValue.enabled) {
          this.inputValue.disable();
        }
      }
  
      this.resourceForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formValues => {
        let fieldValue = formValues[this.conditionalVisibility.field];
        if (fieldValue && typeof fieldValue === 'object' && fieldValue.id) {
          fieldValue = fieldValue.id;
        }
        const fieldValueStr = fieldValue?.toString();
        if (this.conditionalVisibility.values.includes(fieldValueStr)) {
          if (this.inputValue.disabled) {
            this.inputValue.enable();
          }
        } else {
          if (this.inputValue.enabled) {
            this.inputValue.disable();
          }
        }
      });
    }
  }



  /**
   * Método disparado quando um arquivo é selecionado
   */
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.saveFile(file, this.maxFileSize, this.allowedExtensions).then((response: string) => {
        this.inputValue.setValue(response);
        this.fileName = file.name;
      });
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
        if (translatedLabel === (this.className + "." + this.label)) {
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

  // Define a posição do ícone (função opcional)
  setIconPosition() {
    return 'start'; // Ou 'end', conforme necessário
  }
}
