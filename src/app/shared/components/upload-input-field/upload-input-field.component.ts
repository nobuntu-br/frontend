import { AfterViewInit, Component, Injector, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FieldFile, IFieldFile } from 'app/shared/models/file.model';
import { FileService } from 'app/shared/services/file.service';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { Subject, takeUntil } from 'rxjs';
import { BaseUpoadFieldComponent } from '../base-field/base-upload-field.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-upload-input-field',
  templateUrl: './upload-input-field.component.html',
  styleUrls: ['./upload-input-field.component.scss']
})

export class UploadInputFieldComponent extends BaseUpoadFieldComponent implements AfterViewInit {
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
   * Ação atual
   */
  currentAction: string;
  /**
   * Arquivo que está sendo editado
   */
  fileEdit: IFieldFile;

  public inputValue = new FormControl<string | FieldFile>(null);
  fileName: string = '';
  displayedLabel: string = 'Upload de Arquivo';
  placeholder: string = 'Selecione um arquivo';
  charactersLimit: number = 100;
  isRequired: boolean = true;
  svgIcon: string = 'upload'; // Exemplo de ícone

  constructor(protected injector: Injector, protected fileService: FileService, protected matSnackBar: MatSnackBar, private activatedRoute: ActivatedRoute) {
    super(injector, fileService, matSnackBar);
  }

  ngAfterViewInit(): void {
    this.setLabel();
    this.setCurrentAction();
  }

  /**
   * Método disparado quando um arquivo é selecionado
   */
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if(this.currentAction == "edit"){
        this.updateFile(file, this.fileEdit.id, this.maxFileSize, this.allowedExtensions);
      } else {
        this.saveFile(file, this.maxFileSize, this.allowedExtensions).then((response: any) => {
          this.inputValue.setValue(response);
          this.fileName = file.name;
        });
      }
    }
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

 async displayDataOnEdit() {
    this.inputValue.valueChanges.subscribe(async (value) => {
      if (value) {
        if (typeof value !== 'string' && value?.id) {
          this.fileEdit = await this.getFile(value.id);
          this.fileName = this.setFieldDisplayName(this.fileEdit.files);
          console.log(this.fileEdit);
        }
      }
    });
  }

  private setCurrentAction() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.currentAction = id ? 'edit' : 'new';    
    if (this.currentAction == 'edit') {
      this.displayDataOnEdit();
    }
  }
  
  
  // Define a posição do ícone (função opcional)
  setIconPosition() {
    return 'start'; // Ou 'end', conforme necessário
  }
}
