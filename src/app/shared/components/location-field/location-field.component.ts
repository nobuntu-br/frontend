import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { MatDialog } from '@angular/material/dialog';
import { LocationPickerDialogComponent } from '../location-picker-dialog/location-picker-dialog.component';

@Component({
  selector: 'app-location-field',
  templateUrl: './location-field.component.html',
  styleUrls: ['./location-field.component.scss']
})
export class LocationFieldComponent extends BaseFieldComponent {
  @Input() label: string;
  @Input() isRequired: boolean = false;
  @Input() className: string;

  inputValue = new FormControl('');
  displayedLabel = 'Location';

  constructor(private dialog: MatDialog,
    protected injector: Injector,
  ) {super(injector);}

  getLocation(): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(LocationPickerDialogComponent, {
      width: isMobile ? '100vw' : '70vw', // Aumenta a largura do diálogo
      height: isMobile ? '100vh' : '70vh', // Aumenta a altura do diálogo
      maxWidth: isMobile ? '100vw' : '70vw',
      maxHeight: isMobile ? '100vh' : '70vh',
      panelClass: isMobile ? 'full-screen-dialog' : 'partial-screen-dialog'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.inputValue.setValue(`${result.lat}, ${result.lng}`);
      }
    });
  }
}
