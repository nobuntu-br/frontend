import { Component, Injector, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IFieldFile } from 'app/shared/models/file.model';
import { FileService } from 'app/shared/services/file.service';
import { BaseUpoadFieldComponent } from '../base-field/base-upload-field.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-video-field',
  templateUrl: './video-field.component.html',
  styleUrls: ['./video-field.component.scss']
})
export class VideoFieldComponent extends BaseUpoadFieldComponent implements OnInit {

  @Input() label: string;
  @Input() isRequired: boolean = false;
  @Input() className: string;
  @Input() maxFileSize: number; // Exemplo de tamanho máximo de arquivo

  @ViewChild('videoElement') videoElementRef: ElementRef<HTMLVideoElement>;

  inputValue = new FormControl();  
  isCameraOpen = false;
  videoStream: MediaStream | null = null;
  isFrontCamera = true;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  savedVideoUrl: SafeUrl | null = null;
  showVideoUrl: boolean = false;
  isVideoSaved: boolean = false;

  constructor(protected injector: Injector, protected fileService: FileService, protected matSnackBar: MatSnackBar, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {
    super(injector, fileService, matSnackBar);
  }

  ngOnInit(): void {}

  // Open the camera
  async openCamera() {
    this.isCameraOpen = true;
    await this.startCamera();
  }

  // Start recording video
  startRecording() {
    if (!this.videoStream) return;

    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(this.videoStream);
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };
    this.mediaRecorder.start();
  }

  // Stop recording video
  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const videoBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        this.inputValue.setValue(videoUrl);  // Set the recorded video as input value
        this.savedVideoUrl = this.sanitizer.bypassSecurityTrustUrl(videoUrl); // Sanitize the video URL
        this.showVideoUrl = true; // Show the video URL
        this.closeCamera(); // Close the camera after recording
        this.cdr.detectChanges(); // Force change detection
      };
    }
  }
  
  saveVideo() {
    const videoUrl = this.inputValue.value;
    if (videoUrl) {
      this.savedVideoUrl = this.sanitizer.bypassSecurityTrustUrl(videoUrl);
      this.showVideoUrl = true; // Set showVideoUrl to true
      this.isVideoSaved = true; // Set isVideoSaved to true
      this.inputValue.setValue(null); // Clear the input value to hide the video preview
      this.cdr.detectChanges(); // Force change detection

      // Supondo que você tenha uma referência ao arquivo .mp4
      const fileName = 'video.mp4'; // Nome do arquivo
      const fileType = 'video/mp4'; // Tipo do arquivo
      fetch(videoUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], fileName, { type: fileType });
          this.saveFile(file, this.maxFileSize).then((response) => {
              this.inputValue.setValue(response);
          }, (error) => {
              console.error('Error saving video: ', error);
              this.matSnackBar.open('Erro ao salvar vídeo', 'Fechar', {
                duration: 2000
              });
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
    this.cdr.detectChanges(); // Force change detection
  }

  clearVideo() {
    this.inputValue.setValue(null);
    this.savedVideoUrl = null;
    this.showVideoUrl = false;
    this.isVideoSaved = false; // Reset isVideoSaved
    this.cdr.detectChanges(); // Force change detection
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
      this.cdr.detectChanges(); // Force change detection
    }
  }

  toggleCamera() {
    this.isFrontCamera = !this.isFrontCamera;
    this.startCamera();
  }
}