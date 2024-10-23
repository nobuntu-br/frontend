import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BaseFieldComponent } from '../base-field/base-field.component';
import * as L from 'leaflet'; // Import Leaflet
@Component({
  selector: 'app-capture-location-field',
  templateUrl: './capture-location-field.component.html',
  styleUrls: ['./capture-location-field.component.scss']
})
export class CaptureLocationFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() charactersLimit: number;
  @Input() isRequired: boolean = false;
  @Input() className: string;
  displayedLabel: string;

  inputValue = new FormControl<string | null>(null);
  private ngUnsubscribe = new Subject();
  map: L.Map;
  marker: L.Marker;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.setLabel();
    this.initMap();
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
      error: () => {
        this.displayedLabel = this.setCharactersLimit(this.label, this.charactersLimit);
      },
    });
  }

  // Initialize the map
  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13); // Default center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Update the marker position
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }

      // Set the location to the inputValue
      this.inputValue.setValue(`Lat: ${lat}, Lng: ${lng}`);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
