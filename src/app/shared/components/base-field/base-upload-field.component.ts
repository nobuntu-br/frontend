import { Directive, Injector } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BaseFieldComponent } from './base-field.component';
import { FileService } from 'app/shared/services/file.service';
import { IFieldFile } from 'app/shared/models/file.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive()
export abstract class BaseUpoadFieldComponent extends BaseFieldComponent {
  public translocoService: TranslocoService;

  constructor(protected injector: Injector, protected fileService: FileService, protected matSnackBar: MatSnackBar) {
    super(injector);
  }
  
  async saveFile(file: File | File[], maxFileSize: number, allowedExtensions?: string[]): Promise<string> {
    if(this.checkMaxFileSize(file, maxFileSize)) return;
    if(this.checkAllowedExtensions(file, allowedExtensions)) return;
    if (Array.isArray(file)) {
      return this.saveUploadFile(await this.filesToFieldFiles(file));
    } else {
      return this.saveUploadFile(await this.fileToFieldFile(file));
    }
  }

  async saveUploadFile(file: IFieldFile): Promise<string> {
    return this.fileService.uploadFile(file).toPromise().then((response: string) => {
      this.matSnackBar.open('Arquivo enviado com sucesso', 'Fechar', {
        duration: 2000
      });
      return response;
    }).catch((error) => {
      this.matSnackBar.open('Erro ao enviar arquivo', 'Fechar', {
        duration: 2000
      });
      throw error;
    });
  }

    async fileToFieldFile(file: File): Promise<IFieldFile> {
          const base64 = await this.fileToBase64(file);
          const fieldFile: IFieldFile = {
            fieldType: 'file',
            files: [{
                name: file.name,
                size: file.size,
                extension: file.name.split('.').pop().toLowerCase(),
                dataBlob: file,
                base64: base64
            }]
        };

        return fieldFile;
    }

    async filesToFieldFiles(files: File[]): Promise<IFieldFile> {
        let fieldFile: IFieldFile = {
            fieldType: 'file',
            files: []
        };
        files.forEach(async (file) => {
          const base64 = await this.fileToBase64(file);
            fieldFile.files.push({
                name: file.name,
                size: file.size,
                extension: file.name.split('.').pop().toLowerCase(),
                dataBlob: file,
                base64: base64
            });
        });

        return fieldFile;
    }

    dataURItoBlob(dataURI: string) {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    }

    private checkAllowedExtensions(file: File | File[], allowedExtensions: string[]): boolean {
      if (allowedExtensions == null || allowedExtensions.length === 0) return false;

      if (Array.isArray(file)) {
        return file.some((f) => {
          if (!allowedExtensions.includes(f.name.split('.').pop().toLowerCase())) {
            this.matSnackBar.open('Extensão de arquivo não permitida', 'Fechar', {
              duration: 2000
            });
            return true;
          }
          return false;
        });
      } else {
        if( !allowedExtensions.includes(file.name.split('.').pop().toLowerCase())) {
          this.matSnackBar.open('Extensão de arquivo não permitida', 'Fechar', {
            duration: 2000
          });
          return true;
        }
      }
    }


    private checkMaxFileSize(file: File | File[], maxFileSize: number): boolean {
      if (Array.isArray(file)) {
        return file.some((f) => {
          if (f.size > maxFileSize) {
            this.matSnackBar.open('Arquivo muito grande', 'Fechar', {
              duration: 2000
            });
            return true;
          }
          return false;
        });
      } else {
        if(file.size > maxFileSize) {
          this.matSnackBar.open('Arquivo muito grande', 'Fechar', {
            duration: 2000
          });
          return true;
        }
      }
    }

    private async fileToBase64(file: File): Promise<string> {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              resolve(reader.result.toString());
            };
            reader.onerror = error => reject(error);
          });
        }
  
}
