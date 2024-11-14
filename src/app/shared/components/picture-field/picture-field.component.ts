import { Component, Injector, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { FormControl } from '@angular/forms';
import { FileService } from 'app/shared/services/file.service';
import { IFieldFile } from 'app/shared/models/file.model';

@Component({
  selector: 'app-picture-field',
  templateUrl: './picture-field.component.html',
  styleUrls: ['./picture-field.component.scss']
})
export class PictureFieldComponent extends BaseFieldComponent implements OnInit {

  @Input() label: string;
  @Input() isRequired: boolean = false;
  @Input() className: string;

  @ViewChild('videoElement') videoElementRef: ElementRef<HTMLVideoElement>;

  inputValue = new FormControl();  
  isCameraOpen = false;
  videoStream: MediaStream | null = null;
  isFrontCamera = true;
  savedImageUrl: string | null = null;
  showImageUrl: boolean = false;

  constructor(protected injector: Injector,
              private fileService: FileService
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  // Open the camera
  async openCamera() {
    this.isCameraOpen = true;
    await this.startCamera();
  }

  // Capture image from video stream
  captureImage() {
    if (!this.videoStream) return;

    const videoElement = this.videoElementRef.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/png'); // Save captured image as data URL

    this.inputValue.setValue(imageUrl);  // Set the captured image as input value

    this.closeCamera(); // Close the camera after capturing
  }

  // Save image to local storage
  saveImage() {
    const imageUrl = this.inputValue.value;
    if (imageUrl) {
      localStorage.setItem('savedImage', imageUrl);
      alert('Image saved successfully!');
      console.log("image saved");
      // depois que enviar pro banco preciso que limpe o storage
      this.savedImageUrl = imageUrl;
      this.showImageUrl = true; // Set showImageUrl to true
      this.inputValue.setValue(null); // Clear the input value to hide the image preview

      // Supondo que você tenha uma referência ao arquivo .png
      const fileName = 'image.png'; // Nome do arquivo
      const fileType = 'image/png'; // Tipo do arquivo
      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], fileName, { type: fileType });
          const fieldFile: IFieldFile = {
            fieldType: 'string',
            files: [{
              name: file.name,
              size: file.size,
              extension: 'png',
              dataBlob: file,
            }]
          };
          this.fileService.uploadFile(fieldFile).subscribe((response) => {
            console.log("Valor do arquivo: ", response);
          }, (error) => {
            console.log(error);
            alert('Erro ao fazer upload do arquivo');
          });
        });
    }
  }


  // Close the camera
  closeCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
    this.videoStream = null;
    this.isCameraOpen = false;
  }

  clearImage() {
    this.inputValue.setValue(null);
    this.savedImageUrl = null;
    this.showImageUrl = false;
  }

  async startCamera() {
    const constraints = {
      video: {
        facingMode: this.isFrontCamera ? 'user' : 'environment'
      }
    };

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = this.videoElementRef.nativeElement;
      videoElement.srcObject = this.videoStream;
      videoElement.play();
    } catch (error) {
      console.error('Error accessing camera: ', error);
      this.isCameraOpen = false;
    }
  }

  toggleCamera() {
    this.isFrontCamera = !this.isFrontCamera;
    this.startCamera();
  }
}